import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: "json" | "csharp";
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  placeholder,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(400, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="absolute top-2 right-2 z-10">
        <span className="text-xs font-mono uppercase px-2 py-1 rounded bg-muted text-muted-foreground">
          {language === "json" ? "JSON" : "C#"}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          "w-full min-h-[400px] p-4 font-mono text-sm resize-none",
          "bg-card text-card-foreground border border-border rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          "placeholder:text-muted-foreground",
          readOnly && "cursor-default bg-muted/30"
        )}
      />
    </div>
  );
}
