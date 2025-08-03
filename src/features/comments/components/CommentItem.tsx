import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { EditableField } from "@/components/ui/EditableField";
import { RichTextOutput } from "@/components/ui/RichTextOutput";
import { getAbsoluteUrl } from "@/lib/utils";
interface CommentItemProps {
  comment: any;
  taskId: string;
}

export function CommentItem({ comment, taskId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateCommentMutation = useApiMutation({
    mutationFn: (data: { content: string }) =>
      api.put(`/comments/${comment.id}`, data),
    successMessage: "Comment updated.",
    invalidateQueries: [["comments", taskId]],
  });

  const deleteCommentMutation = useApiMutation<void, string>({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    successMessage: "Comment deleted.",
    invalidateQueries: [["comments", taskId]],
  });

  const handleSave = (newContent: string) => {
    updateCommentMutation.mutate(
      { content: newContent },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment.id);
    }
  };

  const canEdit = true; // Replace with actual permission check if needed

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={getAbsoluteUrl(comment.author.avatarUrl)} />
        <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.author.name}</span>
            <span className="text-muted-foreground text-xs">
              {new Date(comment.createdAt).toLocaleString("en-US")}
            </span>
          </div>
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="mt-1 rounded-md bg-gray-100 p-2 text-sm">
          {isEditing ? (
            <EditableField
              initialValue={comment.content}
              onSave={handleSave}
              as="richtext"
            />
          ) : (
            <RichTextOutput
              html={comment.content}
              className="prose prose-sm max-w-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}