You are an expert AI full-stack developer. Your mission is to implement a complete frontend interface for all endpoints and functionality defined in the provided backend codebase. You will build this interface into the existing frontend codebase. Only work on the frontend, and don't create any new files unless necessary for the new features - try to keep the logic in the currently existing files where appropriate. You will first generate a complete implementation plan based on the modular architecture. Then, you will execute that plan in large batches of files within this single conversation. Make sure to give me every new or changed file once, and only once, as you make the complete changes for each one. I will simply say "continue" to receive the next batch. Do not stop until you have fully implemented the entire plan.

For the types files, make sure they work in the frontent (the frontend cant import '@prisma/client' or '../../../core/domain/factories/zod.factory.js', as this exists only in the backend - is validation even necessary on the frontend if its done on the backend anyway? Also, how to make sure the types on the frontend are autmatically synced with the ones defined on the backend?).

Also, the workspaces should be the most basic organising layer. Users can be added to workspaces by admins/superadmins. Jobs/Notifications/Announcements are shown for all workspaces the user is a member of (indicating the workspace). The integrations should be seperate for each workspaces, and google does not need seperate integrations for each tool (one integration with all necessary permissions). The chat should be global (one chat with potentially endless channels for all workspaces). The CRM, Whiteboard, and knowledge board should be global, but instances of them/parts of them can be added to workspaces. If there are changes needed in the backend to achieve that, let me know.

### **1. Core Instructions & Constraints**

You must adhere to the following rules throughout the entire process:

1.  **Analyze Existing Code First**: Thoroughly analyze the provided `backend_collated.txt` file to understand the API contract (endpoints, data models, Zod schemas) and the `frontend_core.txt` file for the existing frontend architecture. All new code must be architecturally consistent with the existing frontend patterns: React, TypeScript, TanStack Query for data fetching, Zustand for state management, React Hook Form for forms, Shadcn/ui for components, Tailwind CSS for styling, and React Router for navigation.
2.  **Holistic Implementation**: Implement the frontend for **all** backend features from your plan simultaneously across the codebase. Each file you provide must contain the complete and final changes required for **all** features that affect it. Do not implement features one by one; your goal is a single, comprehensive update delivered over multiple responses. It is absolutely crucial that **all new features are implemented at once, not in parts.**
3.  **Frontend Only**: All modifications are to be made **only to the frontend codebase**. You will use the backend code solely as a reference for the API you need to implement against.
4.  **Production-Ready Code**: Provide **complete, final, copy-paste-ready code** for every new or modified file. Do not use placeholders, summaries, comments like `// ... rest of the code`, or ellipses (`...`). Every file must be whole and production-ready.
5.  **Strict File Formatting**: For each file, use the following format. Provide **only** the files that are new or have been changed. Make the files copyable by clicking on a button.
    // FILE: path/to/the/file/filename.ext
    ```
    ... full, complete content of the file without any comments ...
    ```
6.  **Efficiency and Structure**:
    - Do **not** include unchanged files in your response. Do not give me any file multiple times - each file MUST only be given ONCE if and only if it requires changes.
    - Structure your response to deliver at least **20 modified/new files at a time** to maximize progress per interaction.
    - Execute the plan in a logical, feature-driven order.
7.  **Frontend Constraints**:
    - Begin by defining all necessary TypeScript types and Zod schemas based on the backend API.
    - Implement robust data fetching using custom hooks (e.g., `useApiResource`, `useApiMutation`) for all new entities.
    - Ensure all new API endpoints are called through the existing `src/lib/api.ts` Axios client.
    - Create reusable, responsive, and accessible UI components using the existing Shadcn/ui library.
    - Add all new pages and views to the routing structure in `src/App.tsx`.
