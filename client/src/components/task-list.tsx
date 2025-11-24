import { Task } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { gutCriteria, calculatePriority } from "@/lib/gut";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);

  const toggleTask = async (task: Task) => {
    await apiRequest("PATCH", `/api/tasks/${task.id}`, {
      completed: !task.completed
    });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const deleteTask = async (id: number) => {
    await apiRequest("DELETE", `/api/tasks/${id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const updateTaskScore = async (taskId: number, field: 'gravity' | 'urgency' | 'tendency', value: number) => {
    await apiRequest("PATCH", `/api/tasks/${taskId}`, {
      [field]: value
    });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-sensitive"
            checked={showSensitive}
            onCheckedChange={setShowSensitive}
          />
          <Label htmlFor="show-sensitive" className="flex items-center gap-2">
            {showSensitive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showSensitive ? "Hide Sensitive Tasks" : "Show Sensitive Tasks"}
          </Label>
        </div>
      </div>

      {tasks
        .filter(task => !task.sensitive || showSensitive)
        .map(task => (
          <Card key={task.id} className={`p-4 ${task.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task)}
                />
                <span className={`text-lg ${task.completed ? 'line-through' : ''}`}>
                  {task.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg font-mono">
                  {calculatePriority(task.gravity, task.urgency, task.tendency)}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                >
                  {expandedTask === task.id ? <ChevronUp /> : <ChevronDown />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {(['gravity', 'urgency', 'tendency'] as const).map((metric) => (
                    <div key={metric} className="space-y-2">
                      <label className="text-sm font-medium capitalize">{metric}</label>
                      <Select
                        value={task[metric].toString()}
                        onValueChange={(value) => updateTaskScore(task.id, metric, parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(gutCriteria[metric]).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {value} - {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {task.labels && task.labels.length > 0 && (
                  <div className="flex gap-2">
                    {task.labels.map(label => (
                      <Badge key={label} variant="outline">{label}</Badge>
                    ))}
                  </div>
                )}
                {task.notes && <p className="mt-2 text-muted-foreground">{task.notes}</p>}
              </div>
            )}
          </Card>
        ))}
    </div>
  );
}