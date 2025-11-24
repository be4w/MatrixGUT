import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { TaskList } from "@/components/task-list";
import { AddTaskForm } from "@/components/add-task-form";
import { FocusMode } from "@/components/focus-mode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Target, List } from "lucide-react";

export default function Home() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string>("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const filteredTasks = tasks
    .filter(task => showCompleted || !task.completed)
    .filter(task => !labelFilter || task.labels?.includes(labelFilter))
    .sort((a, b) => {
      const priorityA = a.gravity * a.urgency * a.tendency;
      const priorityB = b.gravity * b.urgency * b.tendency;
      return priorityB - priorityA;
    });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">ADHD Task Manager</h1>
        <Button
          onClick={() => setFocusMode(!focusMode)}
          variant={focusMode ? "secondary" : "outline"}
        >
          {focusMode ? <List className="mr-2" /> : <Target className="mr-2" />}
          {focusMode ? "List View" : "Focus Mode"}
        </Button>
      </div>

      {focusMode ? (
        <FocusMode tasks={filteredTasks} />
      ) : (
        <>
          <div className="space-y-4 mb-8">
            <AddTaskForm />
          </div>

          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed">Show Completed</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filter by label"
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          <TaskList tasks={filteredTasks} />
        </>
      )}
    </div>
  );
}
