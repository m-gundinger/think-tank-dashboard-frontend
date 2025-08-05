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
} from "@/components/ui/command";
import { Plus, Trash2 } from "lucide-react";
import { useManageCrmAttachments } from "../api/useManageCrmAttachments";
import { useManagePublications } from "@/features/publications/api/useManagePublications";
import { getIcon } from "@/lib/icons";
import { AnyValue } from "@/types";

export function CrmAttachments({
  entity,
  entityType,
}: {
  entity: AnyValue;
  entityType: "organizations" | "people";
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { useAttachPublication, useDetachPublication } =
    useManageCrmAttachments(entityType, entity.id);

  const attachMutation = useAttachPublication();
  const detachMutation = useDetachPublication();

  const { data: pubsData } = useManagePublications().useGetAll();

  const handleAttach = (attachmentId: string) => {
    attachMutation.mutate(attachmentId);
    setPopoverOpen(false);
  };

  const handleDetach = (attachmentId: string) => {
    detachMutation.mutate(attachmentId);
  };

  const attachments = (entity.publications || []).map((p: any) => ({
    ...p,
    type: "Publication",
    plural: "publications",
  }));

  if (!pubsData) {
    return null;
  }

  return (
    <div className="space-y-2 px-2">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Attached Publications
        </h3>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Attach Publication..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {pubsData?.data?.map((pub: any) => (
                    <CommandItem
                      key={pub.id}
                      onSelect={() => handleAttach(pub.id)}
                    >
                      {pub.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-1">
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
                  onClick={() => handleDetach(item.id)}
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
