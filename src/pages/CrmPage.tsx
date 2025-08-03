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

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isCreatePersonOpen, setIsCreatePersonOpen] = useState(false);
  const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] =
    useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);

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
          <ResourceCrudDialog
            isOpen={isCreatePersonOpen}
            onOpenChange={setIsCreatePersonOpen}
            trigger={
              <Button onClick={() => setIsCreatePersonOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Person
              </Button>
            }
            title="Create New Person"
            description="Add a new person to the CRM. This won't create a system user account."
            form={PersonForm}
            resourcePath="people"
            resourceKey={["people"]}
          />
          <ResourceCrudDialog
            isOpen={isCreateOrganizationOpen}
            onOpenChange={setIsCreateOrganizationOpen}
            trigger={
              <Button onClick={() => setIsCreateOrganizationOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            }
            title="Create New Organization"
            description="Add a new organization or organization to the CRM."
            form={OrganizationForm}
            resourcePath="organizations"
            resourceKey={["organizations"]}
          />
          <ResourceCrudDialog
            isOpen={isCreateDealOpen}
            onOpenChange={setIsCreateDealOpen}
            trigger={
              <Button onClick={() => setIsCreateDealOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            }
            title="Create New Deal"
            description="Add a new deal to your pipeline."
            form={DealForm}
            resourcePath="deals"
            resourceKey={["deals"]}
          />
        </div>
      </div>

      <Tabs defaultValue="deals">
        <TabsList>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>
        <TabsContent value="deals" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
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
          <DealPipeline onDealSelect={setSelectedDealId} />
        </TabsContent>
        <TabsContent value="people" className="mt-4">
          <PersonList onPersonSelect={setSelectedPersonId} />
        </TabsContent>
        <TabsContent value="organizations" className="mt-4">
          <OrganizationList onOrganizationSelect={setSelectedOrganizationId} />
        </TabsContent>
      </Tabs>

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