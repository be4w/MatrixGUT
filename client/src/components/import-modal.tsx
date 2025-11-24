import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTION_HEADERS = [
  'HOJE',
  'AMANHÃ',
  'EM BREVE',
  'OUTRO DIA',
  'TODAS AS TAREFAS',
];

function parseAnyDoTasks(content: string): string[] {
  if (!content.trim()) {
    return [];
  }

  const lines = content.split('\n');
  const tasks: string[] = [];
  let currentTask: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trimStart();

    if (trimmedLine.startsWith('☐') || trimmedLine.startsWith('☑') || trimmedLine.startsWith('✓')) {
      if (currentTask !== null) {
        tasks.push(currentTask.trim());
      }

      const taskText = trimmedLine.substring(1).trimStart();
      
      let cleanedTask = taskText;
      for (const header of SECTION_HEADERS) {
        if (taskText.endsWith(header)) {
          cleanedTask = taskText.substring(0, taskText.length - header.length).trim();
          break;
        }
      }
      
      currentTask = cleanedTask;
    } else if (currentTask !== null) {
      if (trimmedLine === '' || 
          trimmedLine.startsWith('Any.do |') || 
          trimmedLine === 'Esta lista foi criada por www.any.do' ||
          SECTION_HEADERS.some(header => trimmedLine === header || trimmedLine.startsWith(header))) {
        continue;
      }

      let continuationText = line;
      for (const header of SECTION_HEADERS) {
        if (continuationText.endsWith(header)) {
          continuationText = continuationText.substring(0, continuationText.length - header.length).trim();
          break;
        }
      }
      
      if (continuationText.trim()) {
        currentTask += '\n' + continuationText.trim();
      }
    }
  }

  if (currentTask !== null) {
    tasks.push(currentTask.trim());
  }

  return tasks.filter(task => task.length > 0);
}

export function ImportModal({ open, onOpenChange }: ImportModalProps) {
  const [content, setContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please paste the full Google Keep note",
        variant: "destructive",
      });
      return;
    }

    const tasks = parseAnyDoTasks(content);

    if (tasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No tasks found. Make sure you copied the complete note from Google Keep.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      for (const taskName of tasks) {
        await apiRequest("POST", "/api/tasks", {
          name: taskName,
          gravity: 1,
          urgency: 1,
          tendency: 1,
          sensitive: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      toast({
        title: "Import successful",
        description: `Imported ${tasks.length} task${tasks.length === 1 ? '' : 's'} from Any.do!`,
      });

      setContent("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" data-testid="dialog-import-modal">
        <DialogHeader>
          <DialogTitle>Paste your Any.do → Google Keep note</DialogTitle>
          <DialogDescription>
            Copy your tasks from Google Keep and paste them below. All tasks will be imported with default priority.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          data-testid="textarea-import-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the entire note here, including title and footer"
          className="min-h-[300px] font-mono text-sm"
        />

        <DialogFooter>
          <Button
            data-testid="button-cancel-import"
            variant="outline"
            onClick={() => {
              setContent("");
              onOpenChange(false);
            }}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            data-testid="button-import-tasks"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import Tasks"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
