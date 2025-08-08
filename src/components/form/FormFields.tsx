import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { ComponentProps } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { AssigneeSelector } from "@/features/project-management/components/AssigneeSelector";
import { TaskTypeSelector } from "@/features/project-management/components/TaskTypeSelector";

interface FormInputProps extends ComponentProps<typeof Input> {
  name: string;
  label: string;
}

export function FormInput({ name, label, ...props }: FormInputProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormTextareaProps extends ComponentProps<typeof Textarea> {
  name: string;
  label: string;
}

export function FormTextarea({ name, label, ...props }: FormTextareaProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...props} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormSelectProps extends ComponentProps<typeof Select> {
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  ...props
}: FormSelectProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            {...props}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormDatePickerProps {
  name: string;
  label: string;
}

export function FormDatePicker({ name, label }: FormDatePickerProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormRichTextEditorProps {
  name: string;
  label: string;
  description?: string;
}

export function FormRichTextEditor({
  name,
  label,
  description,
}: FormRichTextEditorProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormMultiSelectProps {
  name: string;
  label: string;
  placeholder: string;
  options: any[];
}

export function FormMultiSelect({
  name,
  label,
  placeholder,
  options,
}: FormMultiSelectProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            options={options}
            selected={field.value ?? []}
            onChange={field.onChange}
            placeholder={placeholder}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormSwitchProps extends ComponentProps<typeof Switch> {
  name: string;
  label: string;
  description?: string;
}

export function FormSwitch({ name, label, description }: FormSwitchProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface FormMultiSelectPopoverProps {
  name: string;
  label: string;
  placeholder: string;
  options: { id: string; name: string }[];
}

export function FormMultiSelectPopover({
  name,
  label,
  placeholder,
  options,
}: FormMultiSelectPopoverProps) {
  const { control, setValue, watch } = useFormContext();
  const selectedValues = watch(name) || [];
  const selectedItems =
    options.filter((opt) => selectedValues.includes(opt.id)) || [];

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedItems.length && "text-muted-foreground"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item) => (
                        <Badge variant="secondary" key={item.id}>
                          {item.name}
                        </Badge>
                      ))
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option.id);
                      return (
                        <CommandItem
                          value={option.name}
                          key={option.id}
                          onSelect={() => {
                            if (isSelected) {
                              setValue(
                                name,
                                selectedValues.filter(
                                  (id: string) => id !== option.id
                                )
                              );
                            } else {
                              setValue(name, [...selectedValues, option.id]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.name}
                        </CommandItem>
                      );
                    })}
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

interface FormAssigneeSelectorProps {
  name: string;
  label: string;
  projectId?: string;
  workspaceId?: string;
}

export function FormAssigneeSelector({
  name,
  label,
  projectId,
  workspaceId,
}: FormAssigneeSelectorProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <AssigneeSelector
            projectId={projectId}
            workspaceId={workspaceId}
            selectedIds={field.value}
            onSelectionChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormTaskTypeSelectorProps {
  name: string;
  label: string;
  workspaceId?: string;
  projectId?: string;
}

export function FormTaskTypeSelector({
  name,
  label,
  workspaceId,
  projectId,
}: FormTaskTypeSelectorProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <TaskTypeSelector
            workspaceId={workspaceId}
            projectId={projectId}
            value={field.value}
            onValueChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}