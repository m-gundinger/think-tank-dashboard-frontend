import { useApiResource } from "@/hooks/useApiResource";
import { useManageCompanyPeople } from "../api/useManageCompanyPeople";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, UserPlus, XIcon } from "lucide-react";
import { getAbsoluteUrl } from "@/lib/utils";
import { Company, Person } from "@/types";

interface ManageCompanyPeopleProps {
  company: Company;
}

export function ManageCompanyPeople({ company }: ManageCompanyPeopleProps) {
  const { data: peopleData, isLoading: isLoadingPeople } = useApiResource(
    "people",
    ["people"]
  ).useGetAll();
  const {
    addPerson,
    removePerson,
    isLoading: isMutating,
  } = useManageCompanyPeople(company.id);
  const memberIds = new Set(company.people.map((p) => p.id));
  const availablePeople =
    peopleData?.data.filter((person: any) => !memberIds.has(person.id)) || [];
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold">Team Members</h4>
        <div className="mt-2 space-y-2">
          {company.people.length > 0 ? (
            company.people.map((person: Person) => (
              <div
                key={person.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAbsoluteUrl(person.avatarUrl)} />
                    <AvatarFallback>
                      {person.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{`${person.firstName} ${person.lastName}`}</p>
                    <p className="text-muted-foreground text-xs">
                      {person.roleInCompany || "Member"}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => removePerson(person.id)}
                  disabled={isMutating}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No people linked to this company.
            </p>
          )}
        </div>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoadingPeople}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search people..." />
              <CommandList>
                <CommandEmpty>No people found.</CommandEmpty>
                <CommandGroup>
                  {availablePeople.map((person: any) => (
                    <CommandItem
                      value={`${person.firstName} ${person.lastName}`}
                      key={person.id}
                      onSelect={() => {
                        addPerson({ personId: person.id });
                      }}
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      {`${person.firstName} ${person.lastName}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}