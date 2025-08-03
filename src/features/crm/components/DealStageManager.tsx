import { useManageDealStages } from "../api/useManageDealStages";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { z } from "zod";
import { nameSchema } from "@/lib/schemas";
import { useForm, FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateDealStageOrder } from "../api/useUpdateDealStageOrder";
import { useParams } from "react-router-dom";

const stageSchema = z.object({ name: nameSchema("Stage") });
type StageFormValues = z.infer<typeof stageSchema>;

function StageForm({
  onSuccess,
  projectId,
}: {
  onSuccess?: () => void;
  projectId: string;
}) {
  const { useCreate } = useManageDealStages(projectId);
  const createMutation = useCreate();
  const methods = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
  });

  const onSubmit = (values: StageFormValues) => {
    createMutation.mutate({ ...values, projectId }, { onSuccess });
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Stage Name"
            placeholder="e.g., Negotiation"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Stage"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}

function SortableItem({ stage, onRemove, onUpdate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stage.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [name, setName] = useState(stage.name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md bg-white p-2"
    >
      <span {...attributes} {...listeners} className="cursor-grab p-1">
        <GripVertical className="text-muted-foreground h-5 w-5" />
      </span>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => onUpdate(stage.id, { name })}
      />
      <Button variant="ghost" size="icon" onClick={() => onRemove(stage.id)}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>
    </div>
  );
}

export function DealStageManager() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        Deal stages are managed within a project. Please navigate to a project's
        settings to manage its deal stages.
      </div>
    );
  }

  const { useGetAll, useDelete, useUpdate } = useManageDealStages(projectId);
  const { data, isLoading } = useGetAll();
  const deleteMutation = useDelete();
  const updateMutation = useUpdate();
  const updateOrderMutation = useUpdateDealStageOrder();
  const [stages, setStages] = useState(data?.data || []);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setStages(data?.data || []);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over!.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        const orderUpdates = newOrder.map((stage, index) => ({
          id: stage.id,
          order: index,
        }));
        updateOrderMutation.mutate(orderUpdates);
        return newOrder;
      });
    }
  };

  if (isLoading) return <div>Loading stages...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-muted h-96 space-y-2 overflow-y-auto rounded-md p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stages.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {stages.map((stage) => (
              <SortableItem
                key={stage.id}
                stage={stage}
                onRemove={deleteMutation.mutate}
                onUpdate={(id: string, data: { name: string }) =>
                  updateMutation.mutate({ id, data })
                }
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        trigger={
          <Button onClick={() => setIsCreateOpen(true)}>Add Stage</Button>
        }
        title="Create New Deal Stage"
        description="Add a new column to your deals pipeline."
        form={StageForm}
        formProps={{ projectId }}
        resourcePath="deal-stages"
        resourceKey={["dealStages", projectId]}
      />
    </div>
  );
}
