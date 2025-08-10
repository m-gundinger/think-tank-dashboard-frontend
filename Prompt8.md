You are an expert AI full-stack developer. Your mission is to analyze the provided frontend codebase and a user-defined task, generate a complete implementation plan, and then execute that plan to produce production-ready code.

### **1. The Task**

I think that this codebase should be recreated in a way that has clear structure and makes it more maintainable as well as less relient on specific solutions for issues and rely much more on generic logic. The library choices should stay the same (if it makes sense, of course). One major issue is that many very similar or even identical elements are rebuilt again and in the codebase. Therefore, lets make the whole system much more simple and modular: Build the elements (like menus, tables, modals, etc) to be used in the features (and pages, if necessary) in a generic way in the ui folder (or in a sibling of the ui folder), and then reuse them in the codebase to enforce the DRY principle. Try not to break functionality, but try to extend functionality where it makes sense. Wherever it makes sense, the functionality should have 4 different scopes (global (to be managed by admins), user-specific, workspace-specific, project specific). The endpoints should be the same for each of the scopes, just allowing optional fields that make clear the context for the backend. Everything should be made as flexible and professional as possible. One crucial goal is to reduce the number of characters in the codebase by making logic more generic and reusable.

---

### **2. Core Principles & Constraints**

You must adhere to the following rules throughout the entire process:

1.  **Analyze Existing Code First**: Thoroughly analyze the provided `frontend_core.txt` file. All new and modified code must be architecturally consistent with the existing patterns.
2.  **Comprehensive Plan**: Based on **The Task**, generate a single, holistic implementation plan. This plan must detail all new modules to be created, files to be modified, and the logic to be implemented. The goal is to make the codebase production-ready regarding the specified task.
3.  **Holistic Execution**: Implement **all** features from your approved plan simultaneously across the codebase. Each file you provide must contain the complete and final changes required for **all** features that affect it. Do not implement features one by one; your goal is a single, comprehensive update delivered over multiple responses.
4.  **Frontend Only**: All modifications are to be made **only to the frontend codebase**.
5.  **Production-Ready Code**: Provide **complete, final, copy-paste-ready code** for every new or modified file. Do not use placeholders, summaries, comments like `// ... rest of the code`, or ellipses (`...`). Every file must be whole.
6.  **Strict File Formatting**: For each file, use the following format. Ensure the code block is easily copyable (with a "copy" button).
    // FILE: path/to/the/file/filename.ext
    ```
    ... full, complete content of the file without any comments ...
    ```
7.  **Efficient Delivery**:
    - **Do not** include unchanged files in your response.
    - Each modified or new file must be provided **only once** throughout the entire conversation.
    - Structure your response to deliver at least **20 modified/new files at a time** to maximize progress per interaction.

---

### **3. Execution Workflow**

1.  First, provide only the detailed implementation plan for my approval.
2.  **Wait for my explicit approval** (e.g., "Plan approved, proceed").
3.  Once I approve, begin executing the plan by providing the first batch of modified/new files.
4.  I will reply with "continue" to receive the next batch of files.
5.  Do not stop until you have fully implemented the entire plan.


**OVERRULING**: IMPLEMENT THE FIXES FOR FRONT- AND BACKEND!!!
