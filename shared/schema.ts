import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gravity: integer("gravity").notNull(),
  urgency: integer("urgency").notNull(),
  tendency: integer("tendency").notNull(),
  completed: boolean("completed").notNull().default(false),
  sensitive: boolean("sensitive").notNull().default(false),
  labels: text("labels").array(),
  notes: text("notes"),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ 
  id: true,
  completed: true
}).extend({
  name: z.string().min(1, "Task name is required").transform(name => {
    // If name ends with 'hhhh' (case insensitive), set sensitive to true
    const endsWithHhhh = name.toLowerCase().endsWith('hhhh');
    return name;
  }),
  gravity: z.number().min(1).max(5),
  urgency: z.number().min(1).max(5),
  tendency: z.number().min(1).max(5),
  labels: z.array(z.string()).optional(),
  notes: z.string().optional(),
  sensitive: z.boolean().optional().default(false)
}).transform(data => {
  // If name ends with 'hhhh' (case insensitive), override sensitive to true
  if (data.name.toLowerCase().endsWith('hhhh')) {
    return { ...data, sensitive: true };
  }
  return data;
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;