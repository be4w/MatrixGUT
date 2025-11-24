import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { gutCriteria } from "@/lib/gut";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function AddTaskForm() {
  const queryClient = useQueryClient();
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      gravity: 3,
      urgency: 3,
      tendency: 3,
      labels: [],
      notes: "",
      sensitive: false
    }
  });

  const onSubmit = async (data: InsertTask) => {
    await apiRequest("POST", "/api/tasks", data);
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          {["gravity", "urgency", "tendency"].map((metric) => (
            <FormField
              key={metric}
              control={form.control}
              name={metric as keyof InsertTask}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{metric}</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(gutCriteria[metric as keyof typeof gutCriteria]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {value} - {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="work, personal, urgent..."
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => field.onChange(
                    e.target.value.split(",").map(label => label.trim()).filter(Boolean)
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any additional details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sensitive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Sensitive Task</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this task as sensitive to hide it by default
                  <br />
                  <span className="text-xs italic">Tip: Tasks ending with "hhhh" are automatically marked as sensitive</span>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </form>
    </Form>
  );
}