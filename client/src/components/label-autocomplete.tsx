import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LabelAutocompleteProps {
  value: string[];
  onChange: (labels: string[]) => void;
  placeholder?: string;
}

export function LabelAutocomplete({
  value = [],
  onChange,
  placeholder = "work, personal, urgent...",
}: LabelAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Fetch all tasks to get existing labels
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Extract all unique labels from existing tasks
  const existingLabels = useMemo(() => {
    const labelSet = new Set<string>();
    tasks.forEach((task) => {
      task.labels?.forEach((label) => labelSet.add(label));
    });
    return Array.from(labelSet).sort();
  }, [tasks]);

  // Filter labels based on input
  const filteredLabels = useMemo(() => {
    if (!inputValue || !inputValue.trim()) return existingLabels;
    const searchLower = inputValue.toLowerCase();
    const currentLabels = value || [];
    return existingLabels.filter(
      (label) =>
        label.toLowerCase().includes(searchLower) &&
        !currentLabels.includes(label)
    );
  }, [inputValue, existingLabels, value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true); // Keep popover open when typing

    // If user types a comma, add the label before the comma
    if (newValue.includes(",")) {
      const parts = newValue.split(",");
      const labelToAdd = parts[0].trim();
      const currentLabels = value || [];
      if (labelToAdd && !currentLabels.includes(labelToAdd)) {
        onChange([...currentLabels, labelToAdd]);
      }
      setInputValue(parts.slice(1).join(",").trim());
    }
  };

  // Handle selecting a label from suggestions
  const handleSelectLabel = (label: string) => {
    const currentLabels = value || [];
    if (!currentLabels.includes(label)) {
      onChange([...currentLabels, label]);
    }
    setInputValue("");
    setOpen(false);
  };

  // Handle removing a label
  const handleRemoveLabel = (labelToRemove: string) => {
    const currentLabels = value || [];
    onChange(currentLabels.filter((label) => label !== labelToRemove));
  };

  // Handle input keydown (Enter to add current input as new label)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentLabels = value || [];
    if (
      e.key === "Enter" &&
      inputValue &&
      inputValue.trim() &&
      !currentLabels.includes(inputValue.trim())
    ) {
      e.preventDefault();
      onChange([...currentLabels, inputValue.trim()]);
      setInputValue("");
      setOpen(false);
    } else if (e.key === "Escape") {
      // Only works on desktop - mobile users can tap outside or use close button
      setOpen(false);
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      currentLabels.length > 0
    ) {
      // Remove last label if backspace is pressed on empty input
      handleRemoveLabel(currentLabels[currentLabels.length - 1]);
    } else {
      // Keep popover open for other keys
      setOpen(true);
    }
  };

  const currentLabels = value || [];

  return (
    <div className="space-y-2">
      {currentLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {currentLabels.map((label) => (
            <Badge key={label} variant="secondary" className="gap-1 pr-1">
              <span>{label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveLabel(label);
                }}
                className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                aria-label={`Remove ${label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          placeholder={placeholder || "Type to search labels..."}
          value={inputValue || ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          className="w-full"
        />
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            />
          </PopoverTrigger>
          <PopoverContent
            className="w-[400px] max-w-[calc(100vw-1rem)] p-0 max-h-[60vh] flex flex-col"
            align="start"
            sideOffset={5}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              // Don't close if clicking on the input
              const target = e.target as HTMLElement;
              if (target.closest("input")) {
                e.preventDefault();
              }
            }}
          >
            <div className="flex items-center justify-between border-b px-2 py-1 sm:py-1.5 flex-shrink-0">
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                Tap outside to close
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 sm:h-6 sm:w-6"
                onClick={() => setOpen(false)}
                aria-label="Close suggestions"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <Command shouldFilter={false} className="flex-1 min-h-0">
              <CommandList className="max-h-[calc(60vh-3rem)] overflow-y-auto">
                <CommandEmpty>
                  {inputValue && inputValue.trim() ? (
                    <div className="py-1.5 sm:py-2 px-2">
                      <div className="text-[11px] sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 break-words">
                        Press Enter to add &quot;{inputValue.trim()}&quot; as a
                        new label
                      </div>
                      {Array.isArray(currentLabels) &&
                        !currentLabels.includes(inputValue.trim()) && (
                          <CommandItem
                            onSelect={() =>
                              handleSelectLabel(inputValue.trim())
                            }
                            className="cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2"
                          >
                            Add &quot;{inputValue.trim()}&quot;
                          </CommandItem>
                        )}
                    </div>
                  ) : (
                    <div className="py-1.5 sm:py-2 px-2 text-[11px] sm:text-sm text-muted-foreground">
                      No labels found. Start typing to create a new label.
                    </div>
                  )}
                </CommandEmpty>
                {Array.isArray(filteredLabels) && filteredLabels.length > 0 && (
                  <CommandGroup
                    heading="Existing Labels"
                    className="[&_[cmdk-group-heading]]:text-[10px] sm:[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1"
                  >
                    {filteredLabels.map((label) => {
                      if (!label || typeof label !== "string") return null;
                      return (
                        <CommandItem
                          key={label}
                          onSelect={() => handleSelectLabel(label)}
                          className="cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2 break-words"
                        >
                          {label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
                {inputValue &&
                  inputValue.trim() &&
                  Array.isArray(currentLabels) &&
                  !currentLabels.includes(inputValue.trim()) &&
                  Array.isArray(filteredLabels) &&
                  !filteredLabels.includes(inputValue.trim()) && (
                    <CommandGroup className="[&_[cmdk-group-heading]]:text-[10px] sm:[&_[cmdk-group-heading]]:text-xs">
                      <CommandItem
                        onSelect={() => handleSelectLabel(inputValue.trim())}
                        className="cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2 break-words"
                      >
                        Add &quot;{inputValue.trim()}&quot; (new)
                      </CommandItem>
                    </CommandGroup>
                  )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
