import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "../api/useSearch";
import { SearchResultGroup } from "./SearchResultGroup";
interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isLoading } = useSearch(debouncedQuery);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);
  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for projects, tasks, users..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && <div className="p-4 text-sm">Searching...</div>}
        {!isLoading && !results && debouncedQuery.length > 1 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {results && (
          <>
            <SearchResultGroup heading="Projects" results={results.projects} />
            <SearchResultGroup heading="Tasks" results={results.tasks} />
            <SearchResultGroup
              heading="Publications"
              results={results.publications}
            />
            <SearchResultGroup heading="Users" results={results.users} />
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
