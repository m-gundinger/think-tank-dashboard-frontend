import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RichTextOutput } from "@/components/ui/RichTextOutput";
import { getAbsoluteUrl } from "@/lib/utils";
import { CommentAttachments } from "./CommentAttachments";
import { useManageComments } from "../api/useManageComments";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ActionMenu } from "@/components/ui/ActionMenu";

interface CommentItemProps {
  comment: any;
  taskId: string;
}

export function CommentItem({ comment, taskId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { useUpdate, useDelete } = useManageComments(taskId);
  const updateCommentMutation = useUpdate();
  const deleteCommentMutation = useDelete();

  const handleSave = () => {
    updateCommentMutation.mutate(
      { id: comment.id, data: { content: editedContent } },
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

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
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
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString("en-US")}
            </span>
          </div>
          {canEdit && !isEditing && (
            <ActionMenu
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              deleteDisabled={deleteCommentMutation.isPending}
            />
          )}
        </div>
        <div className="mt-1 rounded-md bg-gray-100 p-2 text-sm">
          {isEditing ? (
            <div className="space-y-2">
              <RichTextEditor
                value={editedContent}
                onChange={setEditedContent}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updateCommentMutation.isPending}
                >
                  {updateCommentMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <RichTextOutput
              html={comment.content}
              className="prose prose-sm max-w-none"
            />
          )}
          {!isEditing && (
            <CommentAttachments comment={comment} taskId={taskId} />
          )}
        </div>
      </div>
    </div>
  );
}