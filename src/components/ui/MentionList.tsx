// FILE: src/components/ui/MentionList.tsx
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  ForwardedRef,
} from "react";
import { cn } from "@/lib/utils";

interface MentionListProps {
  items: { id: string; label: string }[];
  command: (item: { id: string; label: string }) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef(
  (props: MentionListProps, ref: ForwardedRef<MentionListRef>) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item.id, label: item.label });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }
        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }
        if (event.key === "Enter") {
          enterHandler();
          return true;
        }
        return false;
      },
    }));

    return (
      <div className="bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md">
        {props.items.length ? (
          props.items.map((item: any, index: number) => (
            <button
              className={cn(
                "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.label}
            </button>
          ))
        ) : (
          <div className="p-2 text-sm">No result</div>
        )}
      </div>
    );
  }
);

MentionList.displayName = "MentionList";
