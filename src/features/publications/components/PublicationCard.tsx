import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { useManagePublications } from "../api/useManagePublications";

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
  const { useDelete } = useManagePublications();
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Delete publication "${publication.title}"?`)) {
      deleteMutation.mutate(publication.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(publication);
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
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
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