import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PersonForm } from "@/features/crm/components/PersonForm";
import { OrganizationForm } from "@/features/crm/components/OrganizationForm";
import { PersonDetailPanel } from "@/features/crm/components/PersonDetailPanel";
import { OrganizationDetailPanel } from "@/features/crm/components/OrganizationDetailPanel";
import { DealDetailPanel } from "@/features/crm/components/DealDetailPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonList } from "@/features/crm/components/PersonList";
import { OrganizationList } from "@/features/crm/components/OrganizationList";
import { DealPipeline } from "@/features/crm/components/DealPipeline";
import { DealForm } from "@/features/crm/components/DealForm";
import { DealStageManager } from "@/features/crm/components/DealStageManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetProjects } from "@/features/project-management/api/useGetProjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({ open: false, type: "" });
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();

  const { data: workspacesData } = useGetWorkspaces();
  const { data: projectsData } = useGetProjects(workspaceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage all people, organizations, and deals.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setDialogState({ open: true, type: "person" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Person
          </Button>
          <Button
            onClick={() => setDialogState({ open: true, type: "organization" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Organization
          </Button>
          <Button onClick={() => setDialogState({ open: true, type: "deal" })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>

      <Tabs defaultValue="deals">
        <TabsList>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>
        <TabsContent value="deals" className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-end gap-4">
              <div className="w-64">
                <Label>Workspace</Label>
                <Select
                  value={workspaceId}
                  onValueChange={(id) => {
                    setWorkspaceId(id);
                    setProjectId(undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspacesData?.data.map((ws) => (
                      <SelectItem key={ws.id} value={ws.id}>
                        {ws.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-64">
                <Label>Project</Label>
                <Select
                  value={projectId}
                  onValueChange={setProjectId}
                  disabled={!workspaceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectsData?.data.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!projectId}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Stages
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Deal Stages</DialogTitle>
                  <DialogDescription>
                    Add, remove, and reorder the columns in your deals pipeline.
                  </DialogDescription>
                </DialogHeader>
                <DealStageManager />
              </DialogContent>
            </Dialog>
          </div>
          <DealPipeline
            onDealSelect={setSelectedDealId}
            projectId={projectId}
          />
        </TabsContent>
        <TabsContent value="people" className="mt-4">
          <PersonList onPersonSelect={setSelectedPersonId} />
        </TabsContent>
        <TabsContent value="organizations" className="mt-4">
          <OrganizationList onOrganizationSelect={setSelectedOrganizationId} />
        </TabsContent>
      </Tabs>

      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "person"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create New Person"
        description="Add a new person to the CRM. This won't create a system user account."
        form={PersonForm}
        resourcePath="people"
        resourceKey={["people"]}
      />
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "organization"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create New Organization"
        description="Add a new organization or company to the CRM."
        form={OrganizationForm}
        resourcePath="organizations"
        resourceKey={["organizations"]}
      />
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "deal"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create New Deal"
        description="Add a new deal to your pipeline."
        form={DealForm}
        formProps={{ workspaceId, projectId }}
        resourcePath="deals"
        resourceKey={["deals"]}
      />

      <PersonDetailPanel
        personId={selectedPersonId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPersonId(null);
        }}
      />
      <OrganizationDetailPanel
        organizationId={selectedOrganizationId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedOrganizationId(null);
        }}
      />
      <DealDetailPanel
        dealId={selectedDealId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedDealId(null);
        }}
      />
    </div>
  );
}