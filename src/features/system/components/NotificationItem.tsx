import { useMarkNotificationAsRead } from "../api/useMarkNotificationAsRead";
import { cn } from "@/lib/utils";
import { RichTextOutput } from "@/components/ui/RichTextOutput";
export function NotificationItem({ notification }: { notification: any }) {
  const markAsReadMutation = useMarkNotificationAsRead();
  const handleClick = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "hover:bg-accent flex cursor-pointer items-start gap-3 p-3",
        !notification.isRead && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onClick={handleClick}
    >
      {!notification.isRead && (
        <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
      )}
      <div className={cn("grid gap-1", notification.isRead && "pl-5")}>
        <RichTextOutput
          html={notification.message}
          className="text-sm font-medium"
        />
        <p className="text-muted-foreground text-sm">
          {new Date(notification.createdAt).toLocaleString("en-US")}
        </p>
      </div>
    </div>
  );
}
