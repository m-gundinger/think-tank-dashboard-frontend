import { useManageKnowledgeBase } from "../api/useManageKnowledgeBase";
import { useManageKnowledgePages } from "../api/useManageKnowledgePages";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useState } from "react";
import { RichTextOutput } from "@/components/ui/RichTextOutput";

function PageList({ pages, onSelectPage, selectedPageId }: any) {
  return (
    <nav className="space-y-1">
      {pages.map((page: any) => (
        <button
          key={page.id}
          onClick={() => onSelectPage(page)}
          className={`w-full rounded-md p-2 text-left text-sm ${
            selectedPageId === page.id ? "bg-accent" : "hover:bg-accent/50"
          }`}
        >
          {page.title}
        </button>
      ))}
    </nav>
  );
}

export function KnowledgeBaseDetailView({
  workspaceId,
  knowledgeBaseId,
}: {
  workspaceId: string;
  knowledgeBaseId: string;
}) {
  const [selectedPage, setSelectedPage] = useState<any | null>(null);

  const {
    data: kbData,
    isLoading: isLoadingKb,
    isError: isKbError,
  } = useManageKnowledgeBase(workspaceId).useGetOne(knowledgeBaseId);

  const {
    data: pagesData,
    isLoading: isLoadingPages,
    isError: isPagesError,
  } = useManageKnowledgePages(workspaceId, knowledgeBaseId).useGetAll();

  const isLoading = isLoadingKb || isLoadingPages;
  const isError = isKbError || isPagesError;

  if (isLoading) {
    return (
      <div className="grid h-full grid-cols-4 gap-6">
        <div className="col-span-1">
          <Skeleton className="h-8 w-3/4" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="col-span-3">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load knowledge base"
        message="Please try again."
      />
    );
  }

  return (
    <div className="grid h-full grid-cols-4 gap-8">
      <div className="col-span-1 border-r pr-6">
        <h2 className="mb-4 text-xl font-bold">{kbData.name}</h2>
        <PageList
          pages={pagesData?.data || []}
          onSelectPage={setSelectedPage}
          selectedPageId={selectedPage?.id}
        />
      </div>
      <div className="col-span-3">
        {selectedPage ? (
          <article className="prose dark:prose-invert max-w-none">
            <h1>{selectedPage.title}</h1>
            <RichTextOutput html={selectedPage.content?.html} />
          </article>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Select a page to view its content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
