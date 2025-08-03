You are an expert AI full-stack developer. Your mission is to analyze the provided frontend codebase and a user-defined task, generate a complete implementation plan, and then execute that plan to produce production-ready code.

### **1. The Task**

- Make sure all the listed endpoints in the attached document are properly implemented in the frontend. Dont skip a single one.
- Make sure that all endpoint implementations are functional and working (currently not the case).
- Examples:
  [14:24:34 UTC] INFO: incoming request
  requestId: "req-br"
  req: {
  "method": "OPTIONS",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63907
  }
  [14:24:34 UTC] INFO: request completed
  requestId: "req-br"
  res: {
  "statusCode": 204
  }
  responseTime: 0.2746000289916992
  [14:24:34 UTC] INFO: incoming request
  requestId: "req-bs"
  req: {
  "method": "GET",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63920
  }
  [14:24:34 UTC] INFO: Route GET:/api/v1/workspaces not found
  requestId: "req-bs"
  [14:24:34 UTC] INFO: request completed
  requestId: "req-bs"
  res: {
  "statusCode": 404
  }
  responseTime: 0.21799993515014648
  [14:24:35 UTC] INFO: incoming request
  requestId: "req-bt"
  req: {
  "method": "GET",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63920
  }
  [14:24:35 UTC] INFO: Route GET:/api/v1/workspaces not found
  requestId: "req-bt"
  [14:24:35 UTC] INFO: request completed
  requestId: "req-bt"
  res: {
  "statusCode": 404
  }
  responseTime: 0.2976999282836914
  [14:24:37 UTC] INFO: incoming request
  requestId: "req-bu"
  req: {
  "method": "GET",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63920
  }
  [14:24:37 UTC] INFO: Route GET:/api/v1/workspaces not found
  requestId: "req-bu"
  [14:24:37 UTC] INFO: request completed
  requestId: "req-bu"
  res: {
  "statusCode": 404
  }
  responseTime: 0.2980000972747803
  [14:24:41 UTC] INFO: incoming request
  requestId: "req-bv"
  req: {
  "method": "OPTIONS",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63907
  }
  [14:24:41 UTC] INFO: request completed
  requestId: "req-bv"
  res: {
  "statusCode": 204
  }
  responseTime: 0.26489996910095215
  [14:24:41 UTC] INFO: incoming request
  requestId: "req-bw"
  req: {
  "method": "GET",
  "url": "/api/v1/workspaces",
  "host": "localhost:3000",
  "remoteAddress": "127.0.0.1",
  "remotePort": 63920
  }
  [14:24:41 UTC] INFO: Route GET:/api/v1/workspaces not found
  requestId: "req-bw"
  [14:24:41 UTC] INFO: request completed
  requestId: "req-bw"
  res: {
  "statusCode": 404
  }
  responseTime: 0.29089999198913574

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
    - Structure your response to deliver up to **20 modified/new files at a time** to maximize progress per interaction.

---

### **3. Execution Workflow**

1.  First, provide only the detailed implementation plan for my approval.
2.  **Wait for my explicit approval** (e.g., "Plan approved, proceed").
3.  Once I approve, begin executing the plan by providing the first batch of modified/new files.
4.  I will reply with "continue" to receive the next batch of files.
5.  Do not stop until you have fully implemented the entire plan.
