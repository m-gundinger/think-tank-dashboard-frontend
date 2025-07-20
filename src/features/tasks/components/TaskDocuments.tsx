// src/features/tasks/components/TaskDocuments.tsx
import { useMemo, useRef } from "react";
import { DocumentType } from "@/types";
import { Task } from "../task.types";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, Trash2, FileText } from "lucide-react";
import { useAttachDocument } from "../api/useAttachDocument";
import { useDetachDocument } from "../api/useDetachDocument";
import { toast } from "sonner";
import { getAbsoluteUrl } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function DocumentItem({
  doc,
  task,
  onDetach,
}: {
  doc: any;
  task: Task;
  onDetach: (documentId: string, type: DocumentType) => void;
}) {
  const isPropagated = doc.taskId !== task.id;
  return (
    <div className="hover:bg-accent/50 flex items-center justify-between rounded-md p-2 text-sm">
      <a
        href={getAbsoluteUrl(doc.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 items-center gap-2"
      >
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="truncate" title={doc.title}>
          {doc.title}
        </span>
        {isPropagated && (
          <span className="text-muted-foreground text-xs">(from subtask)</span>
        )}
      </a>
      {!isPropagated && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onDetach(doc.documentId, doc.type)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function DocumentList({
  title,
  docs,
  task,
  onDetach,
}: {
  title: string;
  docs: any[];
  task: Task;
  onDetach: (documentId: string, type: DocumentType) => void;
}) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold text-gray-500 uppercase">
        {title} ({docs.length})
      </h4>
      <div className="space-y-1 rounded-md border p-1">
        {docs.length > 0 ? (
          docs.map((doc: any) => (
            <DocumentItem
              key={`${doc.documentId}-${doc.type}`}
              doc={doc}
              task={task}
              onDetach={onDetach}
            />
          ))
        ) : (
          <p className="text-muted-foreground p-2 text-center text-xs">
            No documents attached.
          </p>
        )}
      </div>
    </div>
  );
}

export function TaskDocuments({
  task,
  workspaceId,
  projectId,
}: {
  task: Task;
  workspaceId?: string;
  projectId?: string;
}) {
  const attachMutation = useAttachDocument(workspaceId, projectId, task.id);
  const detachMutation = useDetachDocument(workspaceId, projectId, task.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLInputElement>(null);

  const allDocs = useMemo(() => {
    const collectedDocs = new Map();
    function collect(currentTask: Task) {
      currentTask.documents?.forEach((doc: any) => {
        const key = `${doc.documentId}-${doc.type}`;
        if (!collectedDocs.has(key)) {
          collectedDocs.set(key, { ...doc, taskId: currentTask.id });
        }
      });
      currentTask.subtasks?.forEach(collect);
    }
    collect(task);
    return Array.from(collectedDocs.values());
  }, [task]);

  const inputDocs = allDocs.filter((d) => d.type === DocumentType.INPUT);
  const outputDocs = allDocs.filter((d) => d.type === DocumentType.OUTPUT);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: DocumentType
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size cannot exceed 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    attachMutation.mutate(formData);

    event.target.value = "";
  };

  const handleDetach = (documentId: string, type: DocumentType) => {
    detachMutation.mutate({ documentId, type });
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, DocumentType.INPUT)}
      />
      <input
        type="file"
        ref={outputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, DocumentType.OUTPUT)}
      />
      <h3 className="text-sm font-semibold">Documents</h3>
      <div className="space-y-4">
        <DocumentList
          title="Inputs"
          docs={inputDocs}
          task={task}
          onDetach={handleDetach}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={attachMutation.isPending}
        >
          <Upload className="mr-2 h-4 w-4" /> Attach Input
        </Button>
        <DocumentList
          title="Outputs"
          docs={outputDocs}
          task={task}
          onDetach={handleDetach}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => outputRef.current?.click()}
          disabled={attachMutation.isPending}
        >
          <Paperclip className="mr-2 h-4 w-4" /> Attach Output
        </Button>
      </div>
    </div>
  );
}
