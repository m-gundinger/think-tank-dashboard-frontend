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
import { useManageTaskAttachments } from "../api/useManageTaskAttachments";
import { useGetAllKnowledgeBases } from "@/features/knowledge-base/api/useGetAllKnowledgeBases";
import { useManagePublications } from "@/features/publications/api/useManagePublications";
import { useGetMyWhiteboards } from "@/features/views/api/useGetMyWhiteboards";
import { getIcon } from "@/lib/icons";

export function TaskAttachments({ task, workspaceId, projectId }: any) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { useAttachEntity, useDetachEntity } = useManageTaskAttachments(
    workspaceId,
    projectId,
    task.id
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
    ...(task.knowledgeBases || []).map((kb: any) => ({
      ...kb,
      type: "KnowledgeBase",
      plural: "knowledge-bases",
    })),
    ...(task.publications || []).map((p: any) => ({
      ...p,
      type: "Publication",
      plural: "publications",
    })),
    ...(task.whiteboards || []).map((w: any) => ({
      ...w,
      type: "Whiteboard",
      plural: "whiteboards",
    })),
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Attachments</h3>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Attach..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Knowledge Bases">
                  {kbsData?.data?.map((kb: any) => (
                    <CommandItem
                      key={kb.id}
                      onSelect={() => handleAttach(kb.id, "knowledge-bases")}
                    >
                      {kb.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Publications">
                  {pubsData?.data?.map((pub: any) => (
                    <CommandItem
                      key={pub.id}
                      onSelect={() => handleAttach(pub.id, "publications")}
                    >
                      {pub.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Whiteboards">
                  {whiteboardsData?.data?.map((wb: any) => (
                    <CommandItem
                      key={wb.id}
                      onSelect={() => handleAttach(wb.id, "whiteboards")}
                    >
                      {wb.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border p-1">
        {attachments.length > 0 ? (
          attachments.map((item: any) => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="hover:bg-accent/50 flex items-center justify-between rounded-md p-2 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.name || item.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDetach(item.id, item.plural)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground p-2 text-center text-xs">
            No attachments.
          </p>
        )}
      </div>
    </div>
  );
}
