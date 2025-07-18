import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
interface WorkflowRunDetailProps {
  run: any | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusColors: Record<string, string> = {
  SUCCESS: "bg-green-500",
  FAILED: "bg-red-500",
  RUNNING: "bg-blue-500",
};
export function WorkflowRunDetail({
  run,
  isOpen,
  onOpenChange,
}: WorkflowRunDetailProps) {
  if (!run) return null;
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>Workflow Run: {run.id}</DrawerTitle>
              <Badge className={cn(statusColors[run.status])}>
                {run.status}
              </Badge>
            </div>
            <DrawerDescription>
              Ran at: {new Date(run.startedAt).toLocaleString("en-US")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-4 px-4 pb-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Trigger Context</h4>
              <ScrollArea className="h-72 w-full rounded-md border">
                <pre className="p-4 text-xs">
                  {JSON.stringify(run.context, null, 2)}
                </pre>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Execution Logs</h4>
              <ScrollArea className="h-72 w-full rounded-md border">
                <pre className="p-4 text-xs">
                  {JSON.stringify(run.logs, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
