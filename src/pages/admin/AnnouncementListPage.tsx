import { AnnouncementList } from "@/features/admin/announcements/components/AnnouncementList";
import { BroadcastNotificationDialog } from "@/features/system/components/BroadcastNotificationDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { AnnouncementForm } from "@/features/admin/announcements/components/AnnouncementForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function AnnouncementListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <ListPageLayout
      title="System Communications"
      description="Create and manage announcements or send real-time broadcasts."
      actionButton={
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
      }
    >
      <AnnouncementList />
    </ListPageLayout>
  );
}