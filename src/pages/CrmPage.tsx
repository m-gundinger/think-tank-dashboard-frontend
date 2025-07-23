import { useState } from "react";
import { PersonList } from "@/features/crm/components/PersonList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PersonForm } from "@/features/crm/components/PersonForm";
import { CompanyForm } from "@/features/crm/components/CompanyForm";
import { PersonDetailPanel } from "@/features/crm/components/PersonDetailPanel";
import { CompanyDetailPanel } from "@/features/crm/components/CompanyDetailPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiResource } from "@/hooks/useApiResource";
import { CompanyCard } from "@/features/crm/components/CompanyCard";
import { EmptyState } from "@/components/ui/empty-state";
import { DealPipeline } from "@/features/crm/components/DealPipeline";

function CompanyList({
  onCompanySelect,
}: {
  onCompanySelect: (id: string) => void;
}) {
  const { data, isLoading } = useApiResource("companies", [
    "companies",
  ]).useGetAll();

  if (isLoading) return <div>Loading companies...</div>;

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-10 w-10" />}
        title="No Companies Found"
        description="Get started by creating your first company."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.data.map((company: any) => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={() => onCompanySelect(company.id)}
        />
      ))}
    </div>
  );
}

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isCreatePersonOpen, setIsCreatePersonOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage all people and companies in your organization.
          </p>
        </div>
        <div>
          <ResourceCrudDialog
            isOpen={isCreatePersonOpen}
            onOpenChange={setIsCreatePersonOpen}
            trigger={
              <Button
                onClick={() => setIsCreatePersonOpen(true)}
                className="mr-2"
              >
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
            resourcePath="companies"
            resourceKey={["companies"]}
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
          <DealPipeline />
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
    </div>
  );
}
