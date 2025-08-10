import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobSystemStatus } from "@/features/admin/jobs/components/JobSystemStatus";
import { JobList } from "@/features/admin/jobs/components/JobList";
import { JobScheduleList } from "@/features/admin/jobs/components/JobScheduleList";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateJobScheduleForm } from "@/features/admin/jobs/components/CreateJobScheduleForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateJobForm } from "@/features/admin/jobs/components/CreateJobForm";
import {
  useCleanupJobs,
  useEmitJobStats,
} from "@/features/admin/jobs/api/useJobSystemActions";
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function JobMonitoringPage() {
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const cleanupJobsMutation = useCleanupJobs();
  const emitStatsMutation = useEmitJobStats();

  return (
    <ListPageLayout
      title="Job Monitoring"
      description="Monitor and manage background jobs and schedules."
    >
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="queue">Job Queue</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="space-y-4">
          <JobSystemStatus />
          <Card>
            <CardHeader>
              <CardTitle>System Actions</CardTitle>
              <CardDescription>
                Perform manual system-level job actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => cleanupJobsMutation.mutate(undefined)}
                disabled={cleanupJobsMutation.isPending}
              >
                {cleanupJobsMutation.isPending
                  ? "Cleaning up..."
                  : "Clean Up Old Jobs"}
              </Button>
              <Button
                variant="outline"
                onClick={() => emitStatsMutation.mutate(undefined)}
                disabled={emitStatsMutation.isPending}
              >
                {emitStatsMutation.isPending
                  ? "Emitting..."
                  : "Emit Stats via WS"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Job Queue</CardTitle>
                <CardDescription>
                  A list of all recent and pending background jobs.
                </CardDescription>
              </div>
              <ResourceCrudDialog
                isOpen={isCreateJobOpen}
                onOpenChange={setIsCreateJobOpen}
                trigger={
                  <Button onClick={() => setIsCreateJobOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Job
                  </Button>
                }
                title="Manually Enqueue Job"
                description="Create and enqueue a new background job with a specific payload."
                form={CreateJobForm}
                resourcePath="admin/jobs"
                resourceKey={["jobs"]}
              />
            </CardHeader>
            <CardContent>
              <JobList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Job Schedules</CardTitle>
                <CardDescription>
                  All recurring jobs defined in the system.
                </CardDescription>
              </div>
              <ResourceCrudDialog
                isOpen={isCreateScheduleOpen}
                onOpenChange={setIsCreateScheduleOpen}
                trigger={
                  <Button onClick={() => setIsCreateScheduleOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Schedule
                  </Button>
                }
                title="Create New Job Schedule"
                description="Define a recurring job that will run automatically."
                form={CreateJobScheduleForm}
                resourcePath="admin/jobs/schedules"
                resourceKey={["jobSchedules"]}
              />
            </CardHeader>
            <CardContent>
              <JobScheduleList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ListPageLayout>
  );
}