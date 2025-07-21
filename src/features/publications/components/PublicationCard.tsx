import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useApiResource } from "@/hooks/useApiResource";

interface PublicationCardProps {
  publication: any;
  onEdit: (publication: any) => void;
}

const statusVariantMap: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
};
export function PublicationCard({ publication, onEdit }: PublicationCardProps) {
  const publicationResource = useApiResource("publications", ["publications"]);
  const deleteMutation = publicationResource.useDelete();
  const handleDelete = () => {
    if (window.confirm(`Delete publication "${publication.title}"?`)) {
      deleteMutation.mutate(publication.id);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex-grow">
          <CardTitle>{publication.title}</CardTitle>
          <CardDescription>
            {publication.excerpt || "No excerpt provided."}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(publication)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex flex-wrap gap-1">
          {publication.authors.map((author: any) => (
            <Badge key={author.id} variant="secondary" className="font-normal">
              {author.name}
            </Badge>
          ))}
        </div>
        <Badge variant={statusVariantMap[publication.status]}>
          {publication.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
