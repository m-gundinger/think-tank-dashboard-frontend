import { useState } from "react";
import { useGetActiveAnnouncements } from "../api/useGetActiveAnnouncements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextOutput } from "@/components/ui/RichTextOutput";

export function ActiveAnnouncements() {
  const { data: announcements, isLoading } = useGetActiveAnnouncements();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  if (isLoading || !announcements || announcements.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const announcementsToShow = announcements.filter(
    (ann) => !dismissedIds.includes(ann.id)
  );

  if (announcementsToShow.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {announcementsToShow.map((ann) => (
        <Alert key={ann.id}>
          <Megaphone className="h-4 w-4" />
          <div className="flex-grow">
            <AlertTitle className="flex items-center justify-between">
              <span>{ann.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleDismiss(ann.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertTitle>
            <AlertDescription>
              {ann.content?.message ? (
                <RichTextOutput html={ann.content.message} />
              ) : (
                "This announcement does not have a detailed message."
              )}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
}
