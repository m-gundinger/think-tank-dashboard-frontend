import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Plus, Trash2 } from "lucide-react";
import { useManageCommentAttachments } from "../api/useManageCommentAttachments";
import { useGetAllKnowledgeBases } from "@/features/knowledge-base/api/useGetAllKnowledgeBases";
import { useManagePublications } from "@/features/publications/api/useManagePublications";
import { useGetMyWhiteboards } from "@/features/views/api/useGetMyWhiteboards";
import { getIcon } from "@/lib/icons";
import { AnyValue } from "@/types";

export function CommentAttachments({
  comment,
  taskId,
}: {
  comment: AnyValue;
  taskId: string;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { useAttachEntity, useDetachEntity } = useManageCommentAttachments(
    comment.id,
    taskId
  );
  const attachMutation = useAttachEntity();
  const detachMutation = useDetachEntity();

  const { data: kbsData } = useGetAllKnowledgeBases();
  const { data: pubsData } = useManagePublications().useGetAll();
  const { data: whiteboardsData } = useGetMyWhiteboards();

  const handleAttach = (entityId: string, plural: any) => {
    attachMutation.mutate({ entityId, plural });
    setPopoverOpen(false);
  };

  const handleDetach = (entityId: string, plural: any) => {
    detachMutation.mutate({ entityId, plural });
  };

  const attachments = [
    ...(comment.knowledgeBases || []).map((kb: any) => ({
      ...kb,
      type: "KnowledgeBase",
      plural: "knowledge-bases",
    })),
    ...(comment.publications || []).map((p: any) => ({
      ...p,
      type: "Publication",
      plural: "publications",
    })),
    ...(comment.whiteboards || []).map((w: any) => ({
      ...w,
      type: "Whiteboard",
      plural: "whiteboards",
    })),
  ];

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-1">
        {attachments.map((item: any) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              className="hover:bg-accent/50 flex items-center justify-between rounded-md border bg-slate-50 p-1 pr-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-1">
                <Icon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{item.name || item.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-5 w-5"
                onClick={() => handleDetach(item.id, item.plural)}
              >
                <Trash2 className="h-2.5 w-2.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
