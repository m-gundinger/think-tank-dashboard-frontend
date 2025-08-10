import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList, MentionListRef } from "./MentionList";
import api from "@/lib/api";

async function fetchUsers(
  query: string,
  workspaceId?: string,
  projectId?: string
) {
  try {
    const url =
      projectId && workspaceId
        ? `/workspaces/${workspaceId}/projects/${projectId}/members`
        : "/admin/users";

    const { data } = await api.get(url, {
      params: { search: query, limit: 5 },
    });

    const users = projectId
      ? data.map((member: any) => ({ id: member.userId, label: member.name }))
      : data.data.map((user: any) => ({ id: user.id, label: user.name }));

    return users;
  } catch (error) {
    console.error("Failed to fetch users for mentions", error);
    return [];
  }
}

export const suggestion = (workspaceId?: string, projectId?: string) => ({
  items: ({ query }: { query: string }) => {
    return fetchUsers(query, workspaceId, projectId);
  },

  render: () => {
    let component: ReactRenderer<MentionListRef>;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any): boolean {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});