import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { useGetComments } from "../api/useGetComments";
import { useState, useCallback } from "react";
import { useSocketSubscription } from "@/hooks/useSocketSubscription";
import { useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

export function CommentSection({ workspaceId, projectId, taskId }: any) {
  const queryClient = useQueryClient();
  const { data: commentsData, isLoading } = useGetComments(taskId, "TASK");

  const addCommentMutation = useApiMutation({
    mutationFn: (content: string) =>
      api.post("/comments", { content, entityId: taskId, entityType: "TASK" }),
    successMessage: "Comment posted.",
    invalidateQueries: [["comments", taskId]],
  });

  const [newComment, setNewComment] = useState("");

  const handleCommentUpdate = useCallback(
    (event: any) => {
      const { action, comment } = event.payload;
      queryClient.setQueryData(["comments", taskId], (oldData: any) => {
        if (!oldData) return oldData;
        let newComments;
        if (action === "created") {
          newComments = [comment, ...oldData.data];
        } else {
          newComments = oldData.data;
        }
        return { ...oldData, data: newComments };
      });
    },
    [queryClient, taskId]
  );

  useSocketSubscription("Project", projectId, {
    COMMENT_UPDATED: handleCommentUpdate,
  });

  const isCommentEmpty = () => {
    if (!newComment) return true;
    const cleaned = newComment.replace(/<p><\/p>/g, "").trim();
    return cleaned.length === 0;
  };

  const handleAddComment = () => {
    if (!isCommentEmpty()) {
      addCommentMutation.mutate(newComment, {
        onSuccess: () => setNewComment(""),
      });
    }
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Comments</h3>
      <div className="space-y-4">
        {commentsData?.data?.map((comment: any) => (
          <CommentItem key={comment.id} comment={comment} taskId={taskId} />
        ))}
      </div>
      <div className="space-y-2">
        <RichTextEditor
          value={newComment}
          onChange={setNewComment}
          projectId={projectId}
          workspaceId={workspaceId}
        />
        <Button
          onClick={handleAddComment}
          disabled={addCommentMutation.isPending || isCommentEmpty()}
        >
          {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </div>
  );
}