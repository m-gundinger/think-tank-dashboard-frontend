import { CreateAnnouncementDialog } from "@/features/admin/announcements/components/CreateAnnouncementDialog";
import { AnnouncementList } from "@/features/admin/announcements/components/AnnouncementList";
import { BroadcastNotificationDialog } from "@/features/notifications/components/BroadcastNotificationDialog";

export function AnnouncementListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Communications
          </h1>
          <p className="text-muted-foreground">
            Create and manage announcements or send real-time broadcasts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BroadcastNotificationDialog />
          <CreateAnnouncementDialog />
        </div>
      </div>
      <AnnouncementList />
    </div>
  );
}
