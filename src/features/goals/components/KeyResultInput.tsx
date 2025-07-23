import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { KeyResultType } from "@/types";
import { PlusCircle, Trash2 } from "lucide-react";

interface KeyResultInputProps {
  control: Control<any>;
}

export function KeyResultInput({ control }: KeyResultInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "keyResults",
  });
  return (
    <div className="space-y-4">
      <FormLabel>Key Results</FormLabel>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-2 rounded-md border p-4"
          >
            <FormField
              control={control}
              name={`keyResults.${index}.name`}
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Increase user engagement"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.type`}
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="text-xs">Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(KeyResultType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.startValue`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-xs">Start</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.targetValue`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-xs">Target</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.currentValue`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-xs">Current</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-3 flex items-end">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => remove(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            name: "",
            type: KeyResultType.NUMBER,
            startValue: 0,
            targetValue: 100,
            currentValue: 0,
          })
        }
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Key Result
      </Button>
    </div>
  );
}