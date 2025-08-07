You are an expert AI full-stack developer. Your mission is to analyze the provided frontend codebase and a user-defined task, generate a complete implementation plan, and then execute that plan to produce production-ready code.

### **1. The Task**

- While keeping the columns and similar to the look&feel in the kanban board, redesign the list view based on the following mock-up:

<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Management List View</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .task-row:hover .hover-action {
            opacity: 1;
        }
        .task-completed {
            text-decoration: line-through;
            color: #4a5568; /* slate-600 */
        }
        .task-completed .status-pill, .task-completed .priority-flag, .task-completed .assignee-avatar {
             opacity: 0.5;
        }
        .group-header-icon {
            transition: transform 0.2s ease-in-out;
        }
        .group-collapsed .group-header-icon {
            transform: rotate(-90deg);
        }
        .subtask-icon {
             transition: transform 0.2s ease-in-out;
        }
        .subtasks-collapsed .subtask-icon {
            transform: rotate(-90deg);
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-300 antialiased">

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <!-- Header Section -->
        <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">My Tasks</h1>
                <div class="mt-2 flex items-center space-x-1">
                    <button class="px-3 py-1 text-sm font-medium bg-slate-700 text-white rounded-md">List</button>
                    <button class="px-3 py-1 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-md">Kanban</button>
                    <button class="px-3 py-1 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-md">Calendar</button>
                    <button class="px-3 py-1 text-sm font-medium text-slate-400 hover:bg-slate-800 rounded-md">Gantt</button>
                </div>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center space-x-2">
                <button class="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" /></svg>
                    <span>Filter</span>
                </button>
                 <button class="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9M3 12h9m-9 4h13m0-4l3 3m0 0l-3 3m3-3H3" /></svg>
                    <span>Sort</span>
                </button>
                <button class="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                    <span>Columns</span>
                </button>
                <button class="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md">New Task</button>
            </div>
        </header>

        <!-- Task List Container -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-4 px-4 py-3 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div class="col-span-12 sm:col-span-5">Task Name</div>
                <div class="hidden sm:block col-span-2">Assignee</div>
                <div class="hidden sm:block col-span-2">Due Date</div>
                <div class="hidden sm:block col-span-1">Priority</div>
                <div class="hidden sm:block col-span-2">Status</div>
            </div>

            <!-- Task Groups -->
            <div id="task-list">
                <!-- Data will be injected here by JavaScript -->
            </div>
        </div>
    </div>

    <script>
        const tasksData = [
            {
                group: 'In Progress',
                tasks: [
                    { id: 1, name: 'Design final mockups for the new dashboard', assignee: ['S', 'J'], dueDate: '2025-08-10', priority: 'Urgent', status: 'In Progress', subtasks: [
                        { id: 11, name: 'Create mobile view mockups', assignee: ['S'], dueDate: '2025-08-08', priority: 'High', status: 'In Progress', completed: false },
                        { id: 12, name: 'Prototype micro-interactions', assignee: ['J'], dueDate: '2025-08-09', priority: 'Medium', status: 'To Do', completed: false }
                    ], completed: false },
                    { id: 2, name: 'Develop API endpoints for user authentication', assignee: ['A'], dueDate: '2025-08-12', priority: 'High', status: 'In Progress', subtasks: [], completed: false }
                ]
            },
            {
                group: 'To Do',
                tasks: [
                    { id: 3, name: 'Write documentation for the new components', assignee: [], dueDate: '2025-08-15', priority: 'Medium', status: 'To Do', subtasks: [], completed: false },
                    { id: 4, name: 'Set up staging environment on AWS', assignee: ['M'], dueDate: '2025-08-05', priority: 'Urgent', status: 'To Do', subtasks: [], completed: false },
                    { id: 5, name: 'Plan Q4 marketing campaign', assignee: ['L', 'S'], dueDate: '2025-09-01', priority: 'Low', status: 'To Do', subtasks: [], completed: false }
                ]
            },
            {
                group: 'Done',
                tasks: [
                    { id: 6, name: 'Initial project setup and repository creation', assignee: ['M'], dueDate: '2025-08-01', priority: 'High', status: 'Done', subtasks: [], completed: true },
                    { id: 7, name: 'User research interviews', assignee: ['S'], dueDate: '2025-07-28', priority: 'Medium', status: 'Done', subtasks: [], completed: true }
                ]
            }
        ];

        const priorityMap = {
            'Urgent': { color: 'red-500', label: 'Urgent' },
            'High': { color: 'orange-500', label: 'High' },
            'Medium': { color: 'yellow-500', label: 'Medium' },
            'Low': { color: 'blue-500', label: 'Low' }
        };

        const statusMap = {
            'In Progress': { bg: 'bg-blue-600/20', text: 'text-blue-400', dot: 'bg-blue-400' },
            'To Do': { bg: 'bg-slate-600/20', text: 'text-slate-400', dot: 'bg-slate-400' },
            'In Review': { bg: 'bg-purple-600/20', text: 'text-purple-400', dot: 'bg-purple-400' },
            'Done': { bg: 'bg-green-600/20', text: 'text-green-400', dot: 'bg-green-400' }
        };

        const assigneeAvatars = {
            'S': 'https://placehold.co/32x32/9333ea/ffffff?text=S',
            'J': 'https://placehold.co/32x32/db2777/ffffff?text=J',
            'A': 'https://placehold.co/32x32/2563eb/ffffff?text=A',
            'M': 'https://placehold.co/32x32/e11d48/ffffff?text=M',
            'L': 'https://placehold.co/32x32/f59e0b/ffffff?text=L'
        };

        function renderPriority(priority) {
            const config = priorityMap[priority];
            if (!config) return '<div></div>';
            return `
                <div class="flex items-center space-x-2 priority-flag">
                    <svg class="w-4 h-4 text-${config.color}" fill="currentColor" viewBox="0 0 20 20"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.828a.75.75 0 01.686 0l1.657.828 1.657-.828a.75.75 0 01.686 0l1.657.828 1.657-.828a.75.75 0 01.686 0l1.657.828V2.75a.75.75 0 00-1.5 0v3.392l-1.657.828a.75.75 0 01-.686 0l-1.657-.828-1.657.828a.75.75 0 01-.686 0l-1.657-.828-1.657.828a.75.75 0 01-.686 0L5 6.142V2.75z"></path></svg>
                    <span class="hidden lg:inline">${config.label}</span>
                </div>`;
        }
        
        function renderStatus(status) {
            const config = statusMap[status];
            if (!config) return '<div></div>';
            return `
                <div class="status-pill inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}">
                    <span class="w-2 h-2 mr-2 ${config.dot} rounded-full"></span>
                    ${status}
                </div>`;
        }

        function renderAssignees(assignees) {
            if (!assignees || assignees.length === 0) {
                return `<div class="flex items-center justify-center w-7 h-7 border-2 border-dashed border-slate-600 rounded-full text-slate-500 text-xs hover:bg-slate-700 hover:text-white cursor-pointer">+</div>`;
            }
            let html = '<div class="flex -space-x-2 overflow-hidden">';
            assignees.forEach(a => {
                html += `<img class="inline-block h-7 w-7 rounded-full ring-2 ring-slate-800 assignee-avatar" src="${assigneeAvatars[a] || 'https://placehold.co/32x32/71717a/ffffff?text=?'}" alt="Assignee ${a}">`;
            });
            html += '</div>';
            return html;
        }

        function isOverdue(dueDateStr) {
            if (!dueDateStr) return false;
            const dueDate = new Date(dueDateStr);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Compare dates only
            return dueDate < today;
        }

        function formatDate(dueDateStr) {
            if (!dueDateStr) return '<span class="text-slate-500">-</span>';
            const date = new Date(dueDateStr);
            const overdueClass = isOverdue(dueDateStr) ? 'text-red-500 font-semibold' : '';
            return `<span class="${overdueClass}">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>`;
        }

        function renderTask(task, isSubtask = false) {
            const subtaskClass = isSubtask ? 'pl-12 bg-slate-800/50' : '';
            const completedClass = task.completed ? 'task-completed' : '';
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const subtaskToggleHTML = hasSubtasks 
                ? `<button class="subtask-toggle-btn mr-1 p-1 rounded-md hover:bg-slate-700"><svg class="w-4 h-4 subtask-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></button>`
                : `<div class="w-6 mr-1"></div>`;

            let subtasksHTML = '';
            if (hasSubtasks) {
                subtasksHTML = `<div class="subtasks-container hidden">
                    ${task.subtasks.map(sub => renderTask(sub, true)).join('')}
                </div>`;
            }

            return `
                <div data-task-id="${task.id}" class="task-wrapper ${completedClass}">
                    <div class="task-row grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-slate-700/50 hover:bg-slate-800 transition-colors duration-150 ${subtaskClass}">
                        <!-- Task Name -->
                        <div class="col-span-12 sm:col-span-5 flex items-center">
                            <input type="checkbox" class="task-checkbox h-4 w-4 mr-3 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer" ${task.completed ? 'checked' : ''}>
                            ${subtaskToggleHTML}
                            <span class="flex-1 truncate">${task.name}</span>
                        </div>
                        <!-- Assignee -->
                        <div class="hidden sm:block col-span-2">${renderAssignees(task.assignee)}</div>
                        <!-- Due Date -->
                        <div class="hidden sm:block col-span-2 text-sm">${formatDate(task.dueDate)}</div>
                        <!-- Priority -->
                        <div class="hidden sm:block col-span-1">${renderPriority(task.priority)}</div>
                        <!-- Status -->
                        <div class="hidden sm:block col-span-2 relative">
                            ${renderStatus(task.status)}
                            <button class="hover-action absolute right-0 top-1/2 -translate-y-1/2 opacity-0 p-1 rounded-md hover:bg-slate-700 text-slate-400">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                            </button>
                        </div>
                    </div>
                    ${subtasksHTML}
                </div>
            `;
        }

        function render() {
            const taskListEl = document.getElementById('task-list');
            let html = '';
            tasksData.forEach(group => {
                html += `
                    <div class="task-group">
                        <div class="group-header sticky top-0 bg-slate-800/80 backdrop-blur-sm flex items-center px-4 py-2 border-b border-slate-700 cursor-pointer">
                            <svg class="w-5 h-5 mr-2 text-slate-400 group-header-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                            <h3 class="font-semibold text-white">${group.group}</h3>
                            <span class="ml-2 bg-slate-700 text-slate-300 text-xs font-medium px-2 py-0.5 rounded-full">${group.tasks.length}</span>
                        </div>
                        <div class="group-tasks">
                            ${group.tasks.map(task => renderTask(task)).join('')}
                        </div>
                    </div>
                `;
            });
            taskListEl.innerHTML = html;
            addEventListeners();
        }

        function addEventListeners() {
            // Group collapse/expand
            document.querySelectorAll('.group-header').forEach(header => {
                header.addEventListener('click', () => {
                    const groupTasks = header.nextElementSibling;
                    groupTasks.classList.toggle('hidden');
                    header.parentElement.classList.toggle('group-collapsed');
                });
            });

            // Task completion
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const taskRowWrapper = e.target.closest('.task-wrapper');
                    taskRowWrapper.classList.toggle('task-completed', e.target.checked);
                });
            });

            // Sub-task toggle
            document.querySelectorAll('.subtask-toggle-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent row click events
                    const taskWrapper = button.closest('.task-wrapper');
                    const subtasksContainer = taskWrapper.querySelector('.subtasks-container');
                    if(subtasksContainer) {
                        subtasksContainer.classList.toggle('hidden');
                        taskWrapper.classList.toggle('subtasks-collapsed');
                    }
                });
            });
        }

        // Initial render
        document.addEventListener('DOMContentLoaded', render);
    </script>

</body>
</html>


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
