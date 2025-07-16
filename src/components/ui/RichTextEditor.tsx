import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link2,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "./toggle";
import { Separator } from "./separator";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onBlur?: () => void;
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
  };

  return (
    <div className="border-input flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 bg-transparent p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-6" />
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-6" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-6" />
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
      >
        <Link2 className="h-4 w-4" />
      </Toggle>
      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm">
            <Smile className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-full border-none bg-transparent p-0 shadow-none">
          <Picker onEmojiClick={handleEmojiClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  className,
  onBlur,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        blockquote: {
          HTMLAttributes: { class: "border-l-4 pl-4" },
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onBlur() {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[150px] w-full rounded-md rounded-t-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert",
          className
        ),
      },
    },
  });

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
