import { useState } from "react";
import { useManagePublicationCategories } from "../api/useManagePublicationCategories";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { PublicationCategoryForm } from "./PublicationCategoryForm";

export function PublicationCategoryManager() {
  const { useGetAll, useDelete } = useManagePublicationCategories();
  const { data, isLoading } = useGetAll();
  const deleteMutation = useDelete();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = (category: any) => {
    if (window.confirm(`Delete category "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <>
      <div className="space-y-4">
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Category
        </Button>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data && data.data.length > 0 ? (
                data.data.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setEditingId(category.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No categories created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Category"
        description="Create a new category for publications."
        form={PublicationCategoryForm}
        resourcePath="publications/categories"
        resourceKey={["publicationCategories"]}
      />
      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        title="Edit Category"
        description="Edit the category name."
        form={PublicationCategoryForm}
        resourcePath="publications/categories"
        resourceKey={["publicationCategories"]}
        resourceId={editingId}
      />
    </>
  );
}