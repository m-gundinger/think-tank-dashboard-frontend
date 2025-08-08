You are an expert AI full-stack developer. Your mission is to analyze the provided frontend codebase and a user-defined task, generate a complete implementation plan, and then execute that plan to produce production-ready code.

### **1. The Task**

- the agenda view should allow all operations the list view allows. For example, the checkbox in agenda currently has no function.
- the list view should allow tasks and subtasks to be dragged and dropped to make them subtasks of the task/subtask they were dropped on or tasks in the group they were dragged to the group heading of.
- all this should not only apply to 5 levels of subtasks, but for all subtask (potentially infinite levels).
- the option to drag and drop should be visually clear.
- the bulk operations should also allow the users to add the tasks to a project, add a task type, assign users, and add a due date (available for both tasks and subtasks).
- as I want to make the logic consistent/remove redundant files, tell me exactly which files are redundant for the "My Tasks" and "Workspaces" pages (including subpages) and can be deleted.
- Also, solve these issues (there should only be the api/v1/views route, just with the appropriate context for tasks associated to a project):

[19:17:48 UTC] INFO: incoming request
    requestId: "req-98"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57691
    }
[19:17:48 UTC] INFO: request completed
    requestId: "req-98"
    res: {
      "statusCode": 204
    }
    responseTime: 0.14459991455078125
[19:17:48 UTC] INFO: incoming request
    requestId: "req-99"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57704
    }
[19:17:48 UTC] INFO: Socket authenticated successfully via middleware.
    socketId: "Hu1S4Oe_ecrIglXgAAAc"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] INFO: Client connected and authenticated.
    serviceContext: "SocketGatewayService"
    socketId: "Hu1S4Oe_ecrIglXgAAAc"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] INFO: Socket joined default notification room.
    serviceContext: "SocketGatewayService"
    socketId: "Hu1S4Oe_ecrIglXgAAAc"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
    room: "user_notifications:6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] INFO: Socket authenticated successfully via middleware.
    socketId: "WmUv6w2qLWThre_7AAAd"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] INFO: Client connected and authenticated.
    serviceContext: "SocketGatewayService"
    socketId: "WmUv6w2qLWThre_7AAAd"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] INFO: Socket joined default notification room.
    serviceContext: "SocketGatewayService"
    socketId: "WmUv6w2qLWThre_7AAAd"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
    room: "user_notifications:6aabf099-7da2-47ce-adde-3e28204b43d4"
[19:17:48 UTC] DEBUG: Handling event: join_context
    serviceContext: "SocketGatewayService"
    eventName: "join_context"
[19:17:48 UTC] DEBUG: Handling event: join_context
    serviceContext: "SocketGatewayService"
    eventName: "join_context"
[19:17:48 UTC] INFO: Delegating findById operation to repository.
    serviceContext: "ProjectService"
    id: "8baecd4c-97df-4743-bcbe-484da2b8e635"
[19:17:48 UTC] INFO: Attempting: find Project by ID '8baecd4c-97df-4743-bcbe-484da2b8e635'
    repositoryContext: "PrismaProjectRepository"
    repoContext: "PrismaProjectRepository"
    action: "find Project by ID '8baecd4c-97df-4743-bcbe-484da2b8e635'"
    projectId: "8baecd4c-97df-4743-bcbe-484da2b8e635"
[19:17:48 UTC] INFO: Success: find Project by ID '8baecd4c-97df-4743-bcbe-484da2b8e635'
    repositoryContext: "PrismaProjectRepository"
    repoContext: "PrismaProjectRepository"
    action: "find Project by ID '8baecd4c-97df-4743-bcbe-484da2b8e635'"
    projectId: "8baecd4c-97df-4743-bcbe-484da2b8e635"
[19:17:48 UTC] INFO: request completed
    requestId: "req-99"
    res: {
      "statusCode": 200
    }
    responseTime: 7.235800266265869
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9a"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57688
    }
[19:17:48 UTC] INFO: request completed
    requestId: "req-9a"
    res: {
      "statusCode": 204
    }
    responseTime: 0.2884998321533203
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9b"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57691
    }
[19:17:48 UTC] INFO: request completed
    requestId: "req-9b"
    res: {
      "statusCode": 204
    }
    responseTime: 0.160400390625
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9c"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/tasks?sortBy=orderInColumn&sortOrder=asc&limit=15&page=1&includeSubtasks=true&userRole=assignee",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57688
    }
[19:17:48 UTC] INFO: request completed
    requestId: "req-9c"
    res: {
      "statusCode": 204
    }
    responseTime: 0.17199993133544922
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9d"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57704
    }
[19:17:48 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates not found
    requestId: "req-9d"
[19:17:48 UTC] INFO: request completed
    requestId: "req-9d"
    res: {
      "statusCode": 404
    }
    responseTime: 0.4155001640319824
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9e"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57709
    }
[19:17:48 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views not found
    requestId: "req-9e"
[19:17:48 UTC] INFO: request completed
    requestId: "req-9e"
    res: {
      "statusCode": 404
    }
    responseTime: 0.27030038833618164
[19:17:48 UTC] INFO: incoming request
    requestId: "req-9f"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/tasks?sortBy=orderInColumn&sortOrder=asc&limit=15&page=1&includeSubtasks=true&userRole=assignee",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57706
    }
[19:17:48 UTC] INFO: Delegating list tasks for project operation to repository.
    serviceContext: "TaskService"
    projectId: "8baecd4c-97df-4743-bcbe-484da2b8e635"
    query: {
      "page": 1,
      "limit": 15,
      "includeSubtasks": true,
      "sortBy": "orderInColumn",
      "sortOrder": "asc",
      "userRole": "assignee"
    }
[19:17:48 UTC] INFO: request completed
    requestId: "req-9f"
    res: {
      "statusCode": 200
    }
    responseTime: 41.535200119018555
[19:17:49 UTC] INFO: incoming request
    requestId: "req-9g"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57706
    }
[19:17:49 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates not found
    requestId: "req-9g"
[19:17:49 UTC] INFO: request completed
    requestId: "req-9g"
    res: {
      "statusCode": 404
    }
    responseTime: 0.4140000343322754
[19:17:49 UTC] INFO: incoming request
    requestId: "req-9h"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57709
    }
[19:17:49 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views not found
    requestId: "req-9h"
[19:17:49 UTC] INFO: request completed
    requestId: "req-9h"
    res: {
      "statusCode": 404
    }
    responseTime: 0.23379993438720703
[19:17:51 UTC] INFO: incoming request
    requestId: "req-9i"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57709
    }
[19:17:51 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates not found
    requestId: "req-9i"
[19:17:51 UTC] INFO: request completed
    requestId: "req-9i"
    res: {
      "statusCode": 404
    }
    responseTime: 0.5117001533508301
[19:17:51 UTC] INFO: incoming request
    requestId: "req-9j"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57706
    }
[19:17:51 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views not found
    requestId: "req-9j"
[19:17:51 UTC] INFO: request completed
    requestId: "req-9j"
    res: {
      "statusCode": 404
    }
    responseTime: 0.14610004425048828
[19:17:55 UTC] INFO: incoming request
    requestId: "req-9k"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57693
    }
[19:17:55 UTC] INFO: request completed
    requestId: "req-9k"
    res: {
      "statusCode": 204
    }
    responseTime: 0.3263998031616211
[19:17:55 UTC] INFO: incoming request
    requestId: "req-9l"
    req: {
      "method": "OPTIONS",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57692
    }
[19:17:55 UTC] INFO: request completed
    requestId: "req-9l"
    res: {
      "statusCode": 204
    }
    responseTime: 0.21310043334960938
[19:17:55 UTC] INFO: incoming request
    requestId: "req-9m"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57706
    }
[19:17:55 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/task-templates not found
    requestId: "req-9m"
[19:17:55 UTC] INFO: request completed
    requestId: "req-9m"
    res: {
      "statusCode": 404
    }
    responseTime: 0.4517998695373535
[19:17:55 UTC] INFO: incoming request
    requestId: "req-9n"
    req: {
      "method": "GET",
      "url": "/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views",
      "host": "localhost:3000",
      "remoteAddress": "127.0.0.1",
      "remotePort": 57709
    }
[19:17:55 UTC] INFO: Route GET:/api/v1/workspaces/f519013e-83af-4326-8af8-0e829b6ef57c/projects/8baecd4c-97df-4743-bcbe-484da2b8e635/views not found
    requestId: "req-9n"
[19:17:55 UTC] INFO: request completed
    requestId: "req-9n"
    res: {
      "statusCode": 404
    }
    responseTime: 0.24280023574829102
[19:17:55 UTC] INFO: Client disconnected.
    serviceContext: "SocketGatewayService"
    socketId: "Hu1S4Oe_ecrIglXgAAAc"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
    reason: "client namespace disconnect"
[19:17:55 UTC] INFO: Client disconnected.
    serviceContext: "SocketGatewayService"
    socketId: "WmUv6w2qLWThre_7AAAd"
    userId: "6aabf099-7da2-47ce-adde-3e28204b43d4"
    reason: "client namespace disconnect"

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


**OVERRULING**: IMPLEMENT THE FIXES FOR FRONT- AND BACKEND!!!
