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

export function JobMonitoringPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and manage background jobs and schedules.
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="queue">Job Queue</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="space-y-4">
          <JobSystemStatus />
        </TabsContent>
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Queue</CardTitle>
              <CardDescription>
                A list of all recent and pending background jobs.
              </CardDescription>
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
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                trigger={
                  <Button onClick={() => setIsCreateOpen(true)}>
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
    </div>
  );
}
