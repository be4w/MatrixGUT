CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"gravity" integer NOT NULL,
	"urgency" integer NOT NULL,
	"tendency" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"sensitive" boolean DEFAULT false NOT NULL,
	"labels" text[],
	"notes" text
);
