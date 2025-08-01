import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PersonForm } from "@/features/crm/components/PersonForm";
import { CompanyForm } from "@/features/crm/components/CompanyForm";
import { PersonDetailPanel } from "@/features/crm/components/PersonDetailPanel";
import { CompanyDetailPanel } from "@/features/crm/components/CompanyDetailPanel";
import { DealDetailPanel } from "@/features/crm/components/DealDetailPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonList } from "@/features/crm/components/PersonList";
import { CompanyList } from "@/features/crm/components/CompanyList";
import { DealPipeline } from "@/features/crm/components/DealPipeline";

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isCreatePersonOpen, setIsCreatePersonOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage all people, companies, and deals in your organization.
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
            isOpen={isCreateCompanyOpen}
            onOpenChange={setIsCreateCompanyOpen}
            trigger={
              <Button onClick={() => setIsCreateCompanyOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Company
              </Button>
            }
            title="Create New Company"
            description="Add a new company or organization to the CRM."
            form={CompanyForm}
            resourcePath="organizations"
            resourceKey={["organizations"]}
          />
        </div>
      </div>

      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
        </TabsList>
        <TabsContent value="people" className="mt-4">
          <PersonList onPersonSelect={setSelectedPersonId} />
        </TabsContent>
        <TabsContent value="companies" className="mt-4">
          <CompanyList onCompanySelect={setSelectedCompanyId} />
        </TabsContent>
        <TabsContent value="deals" className="mt-4">
          <DealPipeline onDealSelect={setSelectedDealId} />
        </TabsContent>
      </Tabs>

      <PersonDetailPanel
        personId={selectedPersonId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPersonId(null);
        }}
      />
      <CompanyDetailPanel
        companyId={selectedCompanyId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCompanyId(null);
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