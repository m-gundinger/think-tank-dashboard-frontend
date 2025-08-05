import { AnnouncementList } from "@/features/admin/announcements/components/AnnouncementList";
import { BroadcastNotificationDialog } from "@/features/system/components/BroadcastNotificationDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { AnnouncementForm } from "@/features/admin/announcements/components/AnnouncementForm";

export function AnnouncementListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            }
            title="Create New Announcement"
            description="Broadcast information to all users or specific roles."
            form={AnnouncementForm}
            resourcePath="announcements"
            resourceKey={["announcements"]}
          />
        </div>
      </div>
      <AnnouncementList />
    </div>
  );
}