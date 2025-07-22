// FILE: src/features/sprints/components/SprintList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprint } from "../sprint.types";
import { SprintStatus } from "@/types";

interface SprintListProps {
  sprints: Sprint[];
  onStartSprint: (sprintId: string) => void;
  onCompleteSprint: (sprintId: string) => void;
}

export function SprintList({
  sprints,
  onStartSprint,
  onCompleteSprint,
}: SprintListProps) {
  const plannedSprints = sprints.filter(
    (s) => s.status === SprintStatus.PLANNING
  );
  const completedSprints = sprints.filter(
    (s) => s.status === SprintStatus.COMPLETED
  );

  return (
    <div className="space-y-4">
      {plannedSprints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planned Sprints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plannedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span>{sprint.name}</span>
                <Button size="sm" onClick={() => onStartSprint(sprint.id)}>
                  Start Sprint
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {completedSprints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed Sprints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span>{sprint.name}</span>
                <span className="text-muted-foreground text-sm">
                  Completed on {new Date(sprint.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
