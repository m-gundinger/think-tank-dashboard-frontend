import { CommandGroup, CommandSeparator } from "@/components/ui/command";
import { SearchResultItem } from "./SearchResultItem";
export function SearchResultGroup({
  heading,
  results,
}: {
  heading: string;
  results: any[];
}) {
  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <CommandGroup heading={heading}>
        {results.map((item) => (
          <SearchResultItem item={item} key={`${item.__typename}-${item.id}`} />
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
