import { Task } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { gutCriteria, calculatePriority } from "@/lib/gut";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LabelAutocomplete } from "@/components/label-autocomplete";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    name: string;
    labels: string[];
    notes: string;
  } | null>(null);

  const toggleTask = async (task: Task) => {
    await apiRequest("PATCH", `/api/tasks/${task.id}`, {
      completed: !task.completed,
    });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const deleteTask = async (id: number) => {
    await apiRequest("DELETE", `/api/tasks/${id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const updateTaskScore = async (
    taskId: number,
    field: "impact" | "urgency" | "tendency",
    value: number
  ) => {
    await apiRequest("PATCH", `/api/tasks/${taskId}`, {
      [field]: value,
    });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditValues({
      name: task.name,
      labels: task.labels || [],
      notes: task.notes || "",
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditValues(null);
  };

  const saveTask = async (taskId: number) => {
    if (!editValues) return;

    await apiRequest("PATCH", `/api/tasks/${taskId}`, {
      name: editValues.name,
      labels: editValues.labels.length > 0 ? editValues.labels : null,
      notes: editValues.notes || null,
    });

    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    setEditingTask(null);
    setEditValues(null);
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
          <Label
            htmlFor="show-sensitive"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            {showSensitive ? (
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">
              {showSensitive ? "Hide Sensitive Tasks" : "Show Sensitive Tasks"}
            </span>
            <span className="sm:hidden">{showSensitive ? "Hide" : "Show"}</span>
          </Label>
        </div>
      </div>

      {tasks
        .filter((task) => !task.sensitive || showSensitive)
        .map((task) => (
          <Card
            key={task.id}
            className={`p-3 sm:p-4 ${task.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task)}
                  className="flex-shrink-0"
                />
                {editingTask === task.id && editValues ? (
                  <Input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    className="text-base sm:text-lg flex-1 min-w-0"
                    disabled={task.completed}
                  />
                ) : (
                  <span
                    className={`text-base sm:text-lg truncate ${task.completed ? "line-through" : ""
                      }`}
                  >
                    {task.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                <Badge
                  variant="secondary"
                  className="text-sm sm:text-lg font-mono whitespace-nowrap"
                >
                  {calculatePriority(
                    task.impact || 0,
                    task.urgency || 0,
                    task.tendency || 0
                  )}
                </Badge>

                {editingTask === task.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveTask(task.id)}
                      className="text-green-600"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedTask(
                          expandedTask === task.id ? null : task.id
                        )
                      }
                    >
                      {expandedTask === task.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(task)}
                      disabled={task.completed}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {(["impact", "urgency", "tendency"] as const).map(
                    (metric) => (
                      <div key={metric} className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-medium capitalize">
                          {metric}
                        </label>
                        <Select
                          value={(task[metric] || 0).toString()}
                          onValueChange={(value) =>
                            updateTaskScore(task.id, metric, parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(gutCriteria[metric]).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {value} - {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  )}
                </div>

                {editingTask === task.id && editValues ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Labels</Label>
                      <LabelAutocomplete
                        value={editValues.labels}
                        onChange={(labels) =>
                          setEditValues({ ...editValues, labels })
                        }
                        placeholder="Type to search existing labels or add new ones..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Notes</Label>
                      <Textarea
                        value={editValues.notes}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Add any additional details..."
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex gap-2">
                        {task.labels.map((label) => (
                          <Badge key={label} variant="outline">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {task.notes && (
                      <p className="mt-2 text-muted-foreground">{task.notes}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
    </div>
  );
}
