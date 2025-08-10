import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";
import { RichTextOutput } from "./RichTextOutput";

interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  as?: "input" | "textarea" | "richtext";
}

const isRichTextEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const cleaned = html.replace(/<p><\/p>/g, "").trim();
  return cleaned.length === 0;
};

export function EditableField({
  initialValue,
  onSave,
  placeholder,
  className,
  as = "input",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value !== initialValue) {
      onSave(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && as === "input") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setValue(initialValue || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (as === "richtext") {
      return (
        <RichTextEditor value={value} onChange={setValue} onBlur={handleSave} />
      );
    }

    const Component = as === "input" ? Input : Textarea;
    return (
      <Component
        ref={inputRef as any}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  if (as === "richtext") {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={cn(
          "min-h-[123px] w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
          "hover:bg-muted",
          className
        )}
      >
        {!isRichTextEmpty(value) ? (
          <RichTextOutput html={value} />
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "min-h-[40px] w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm",
        "hover:bg-muted",
        className
      )}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
}
