import { CreatePublicationDialog } from "@/features/publications/components/CreatePublicationDialog";
import { PublicationList } from "@/features/publications/components/PublicationList";

export function PublicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Manage your organization's articles, papers, and other publications.
          </p>
        </div>
        <CreatePublicationDialog />
      </div>
      <PublicationList />
    </div>
  );
}
