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
import { Target, List, X } from "lucide-react";

export default function Home() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string>("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks
    .filter((task) => showCompleted || !task.completed)
    .filter((task) => {
      if (!labelFilter.trim()) return true;
      // Case-insensitive filter: check if any label matches
      const filterLower = labelFilter.toLowerCase().trim();
      return (
        task.labels?.some((label) =>
          label.toLowerCase().includes(filterLower)
        ) ?? false
      );
    })
    .sort((a, b) => {
      const priorityA = a.impact * a.urgency * a.tendency;
      const priorityB = b.impact * b.urgency * b.tendency;
      return priorityB - priorityA;
    });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 max-w-4xl pb-safe">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          ADHD Task Manager
        </h1>
        <Button
          onClick={() => setFocusMode(!focusMode)}
          variant={focusMode ? "secondary" : "outline"}
          className="w-full sm:w-auto"
        >
          {focusMode ? (
            <List className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="text-sm sm:text-base">
            {focusMode ? "List View" : "Focus Mode"}
          </span>
        </Button>
      </div>

      {focusMode ? (
        <FocusMode tasks={filteredTasks} />
      ) : (
        <>
          <div className="space-y-4 mb-8">
            <AddTaskForm />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed" className="text-sm sm:text-base">
                Show Completed
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Label
                htmlFor="label-filter"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Filter by label:
              </Label>
              <div className="relative w-full sm:w-40">
                <Input
                  id="label-filter"
                  placeholder="Type label name..."
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                  className="w-full sm:w-40 pr-8 text-sm sm:text-base"
                />
                {labelFilter && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 sm:w-8 min-w-[2.5rem] sm:min-w-[2rem]"
                    onClick={() => setLabelFilter("")}
                    aria-label="Clear filter"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <TaskList tasks={filteredTasks} />
        </>
      )}
    </div>
  );
}
