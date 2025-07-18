import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { useGetNotifications } from "../api/useGetNotifications";
import { NotificationItem } from "./NotificationItem";
import { useMarkAllNotificationsAsRead } from "../api/useMarkAllNotificationsAsRead";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationBell() {
  const { data, isLoading } = useGetNotifications();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending || unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : data?.data?.length > 0 ? (
            data.data.map((notification: any) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <p className="text-muted-foreground p-4 text-center text-sm">
              You're all caught up!
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}