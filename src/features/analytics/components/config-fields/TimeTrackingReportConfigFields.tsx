import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetProjectMembers } from "@/features/project-management/api/useGetProjectMembers";
import { useParams } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function TimeTrackingReportConfigFields() {
  const { control } = useFormContext();
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const { data: membersData } = useGetProjectMembers(workspaceId!, projectId!);

  return (
    <FormField
      control={control}
      name="config.userIds"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Team Members (Optional)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value?.length && "text-muted-foreground"
                )}
              >
                {field.value?.length
                  ? `${field.value.length} selected`
                  : "Select members..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search members..." />
                <CommandList>
                  <CommandEmpty>No members found.</CommandEmpty>
                  <CommandGroup>
                    {membersData?.map((member: any) => (
                      <CommandItem
                        value={member.name}
                        key={member.userId}
                        onSelect={() => {
                          const selected = field.value || [];
                          const isSelected = selected.includes(member.userId);
                          field.onChange(
                            isSelected
                              ? selected.filter(
                                  (id: string) => id !== member.userId
                                )
                              : [...selected, member.userId]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.includes(member.userId)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {member.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}