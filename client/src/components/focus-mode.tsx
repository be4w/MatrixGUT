import { useState } from "react";
import { Task } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { gutCriteria, calculatePriority } from "@/lib/gut";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, SkipForward } from "lucide-react";

interface FocusModeProps {
  tasks: Task[];
}

export function FocusMode({ tasks }: FocusModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const activeTasks = tasks.filter((t) => !t.completed);
  const currentTask = activeTasks[currentIndex];

  if (!currentTask) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">All done! 🎉</h2>
        <p className="text-muted-foreground">No more tasks to focus on.</p>
      </Card>
    );
  }

  const completeTask = async () => {
    await apiRequest("PATCH", `/api/tasks/${currentTask.id}`, {
      completed: true,
    });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const skipTask = () => {
    setCurrentIndex((prev) => (prev + 1) % activeTasks.length);
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{currentTask.name}</h2>
        <Badge variant="secondary" className="text-xl px-4 py-2">
          Priority:{" "}
          {calculatePriority(
            currentTask.gravity,
            currentTask.urgency,
            currentTask.tendency
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {["gravity", "urgency", "tendency"].map((metric) => {
          const value = currentTask[metric as keyof Task] as number;
          return (
            <div key={metric} className="text-center">
              <h3 className="text-lg font-semibold capitalize mb-2">
                {metric}
              </h3>
              <div className="text-3xl font-bold mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">
                {
                  gutCriteria[metric as keyof typeof gutCriteria][
                    value as keyof (typeof gutCriteria)[keyof typeof gutCriteria]
                  ]
                }
              </div>
            </div>
          );
        })}
      </div>

      {currentTask.notes && (
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">{currentTask.notes}</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={completeTask}>
          <CheckCircle2 className="mr-2" /> Complete
        </Button>
        <Button size="lg" variant="outline" onClick={skipTask}>
          <SkipForward className="mr-2" /> Skip
        </Button>
      </div>
    </Card>
  );
}
