import { CommandItem } from "@/components/ui/command";
import { getIcon } from "@/lib/icons";
import { useNavigate } from "react-router-dom";
export function SearchResultItem({ item }: { item: any }) {
  const navigate = useNavigate();
  const getLink = () => {
    switch (item.__typename) {
      case "Project":
        return `/workspaces/${item.workspaceId}/projects/${item.id}`;
      case "Task":
        return `/workspaces/${item.workspaceId}/projects/${item.projectId}?taskId=${item.id}`;
      case "User":
      case "Person":
        return `/profile`; // Assuming admin might search for users and link to a generic profile view.
      case "Publication":
        return `/publications`; // No detail page exists yet. Link to list.
      case "Report":
        return `/analytics/reports`; // No detail page exists yet. Link to list.
      default:
        return "/";
    }
  };
  const handleSelect = () => {
    const url = getLink();
    navigate(url);
  };

  const Icon = getIcon(item.__typename);
  return (
    <CommandItem
      key={item.id}
      onSelect={handleSelect}
      value={item.name || item.title}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{item.name || item.title}</span>
    </CommandItem>
  );
}