import {
  ViewType,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  TaskLinkType,
  CustomFieldType,
  SocialProvider,
  DocumentType,
  GoalStatus,
  KeyResultType,
  InteractionType,
  JobStatus,
  PublicationStatus,
  AnnouncementSeverity,
  SkillCategory,
  ActivityActionType,
  WidgetType,
  AccessRole,
  NotificationType,
  NotificationSeverity,
  WorkflowRunStatus,
} from "./api";

// This will re-export all enums from the api types file
export * from "./api";

export type AnyValue = Record<string, any>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  biography?: string | null;
  phoneNumber?: string | null;
  birthday?: string | null;
  socialLinks?: SocialLink[];
  skills?: Skill[];
  workspaceId?: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  action: string;
  subject: string;
  description: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: { message: string };
  status: PublicationStatus;
  severity: AnnouncementSeverity;
  isPinned: boolean;
  publishedAt: string | null;
  author: {
    id: string;
    name: string;
  };
}

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

export interface JobSchedule {
  id: string;
  name: string;
  jobType: string;
  cronExpression: string;
  payload: any;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedNotificationsResponse
  extends PaginatedResponse<Notification> {
  unreadCount: number;
}

export interface SearchResults {
  projects: Project[];
  tasks: Task[];
  publications: Publication[];
  users: User[];
  reports: Report[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  triggerType: ActivityActionType | null;
  cronExpression: string | null;
  enabled: boolean;
  actions: WorkflowAction[];
}

export interface WorkflowAction {
  id: string;
  type: string;
  config: any;
  order: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: WorkflowRunStatus;
  context: any;
  logs: any;
  startedAt: string;
  completedAt: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  knowledgeBases?: KnowledgeBase[];
  whiteboards?: Whiteboard[];
  publications?: Publication[];
  channels?: Channel[];
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: ProjectStatus;
  isPrivate: boolean;
  workspaceId: string;
  leadId: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  knowledgeBases?: KnowledgeBase[];
  whiteboards?: Whiteboard[];
  publications?: Publication[];
  channels?: Channel[];
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
  }[];
}

export interface TaskType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface TaskAssignee {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface TaskLink {
  id: string;
  type: TaskLinkType;
  targetTask?: {
    id: string;
    title: string;
    status: TaskStatus;
  };
  sourceTask?: {
    id: string;
    title: string;
    status: TaskStatus;
  };
}

export interface CustomFieldDefinitionForTask {
  id: string;
  name: string;
  type: CustomFieldType;
  options: any | null;
}

export interface TaskCustomField {
  fieldId: string;
  value: any;
  definition: CustomFieldDefinitionForTask;
}

export interface TaskDocument {
  documentId: string;
  type: DocumentType;
  title: string;
  url: string;
  fileType: string | null;
  createdAt: string;
  externalUrl: string | null;
  provider: SocialProvider | null;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  shortId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string | null;
  workspaceId: string | null;
  workspaceName?: string | null;
  projectName: string | null;
  taskTypeId?: string | null;
  taskType?: TaskType | null;
  ownerId: string | null;
  creatorId: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  timeEstimate: number | null;
  storyPoints: number | null;
  boardColumnId: string | null;
  orderInColumn: number | null;
  recurrenceRule?: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: TaskAssignee[];
  watchers: TaskAssignee[];
  links: TaskLink[];
  linkedToBy: TaskLink[];
  customFields: TaskCustomField[];
  documents: TaskDocument[];
  parentId: string | null;
  subtasks: Task[];
  checklist?: ChecklistItem[] | null;
  publications?: Publication[];
  whiteboards?: Whiteboard[];
  knowledgeBases?: KnowledgeBase[];
  _count?: {
    comments: number;
    documents: number;
    subtasks: number;
  };
}

export interface ViewColumn {
  id: string;
  name: string;
  order: number;
  viewId: string;
}

export interface View {
  id: string;
  name: string;
  type: ViewType;
  columns: ViewColumn[];
  config?: any;
  filters?: any;
  sorting?: any;
  grouping?: any;
  isPublic: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description: string | null;
  status: GoalStatus;
  workspaceId?: string;
  projectId?: string;
  keyResults: KeyResult[];
}

export interface KeyResult {
  id: string;
  name: string;
  type: KeyResultType;
  startValue: number;
  targetValue: number;
  currentValue: number;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  notes: string;
  date: string;
  actor?: { name: string | null } | null;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  biography: string | null;
  phoneNumber: string | null;
  birthday: string | null;
  socialLinks: SocialLink[];
  skills: Skill[];
  roles: string[];
  organizations: {
    organizationId: string;
    organization: { name: string };
    role: string | null;
  }[];
  roleInOrganization?: string | null;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  domain: string | null;
  logoUrl: string | null;
  people: Person[];
  publications?: Publication[];
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stageId: string;
  stage: DealStage;
  organization: {
    id: string;
    name: string;
  };
  ownerId: string;
  ownerName: string;
  workspaceId: string;
  projectId: string | null;
  contacts: { id: string; name: string; email: string | null }[];
}

export interface DealStage {
  id: string;
  name: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface SocialLink {
  id: string;
  provider: SocialProvider;
  url: string;
}

export interface Report {
  id: string;
  title: string;
  summary: string | null;
  content: any | null;
  isPublic: boolean;
  status: PublicationStatus;
  ownerId: string;
  workspaceId: string | null;
  projectId: string | null;
  taskId: string | null;
}

export interface Activity {
  id: string;
  workspaceId: string | null;
  projectId: string | null;
  taskId: string | null;
  actionType: ActivityActionType;
  details: any;
  actorId: string;
  actor: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  config: any;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  projectId: string | null;
  workspaceId: string | null;
  userId: string | null;
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
}

// Query Types
export interface ListTasksQuery {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  includeSubtasks?: boolean;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "title"
    | "status"
    | "priority"
    | "dueDate"
    | "orderInColumn"
    | "projectName"
    | "workspaceName"
    | "taskTypeName";
  sortOrder?: "asc" | "desc";
  taskOrigin?: "project" | "standalone";
  userRole?: "creator" | "assignee";
}

export interface ListProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "status";
  sortOrder?: "asc" | "desc";
  workspaceId?: string;
}

export interface ListPeopleQuery {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "firstName" | "lastName";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface Comment {
  id: string;
  content: string;
  entityId: string;
  entityType: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  publications?: Publication[];
  whiteboards?: Whiteboard[];
  knowledgeBases?: KnowledgeBase[];
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  status: PublicationStatus;
  excerpt: string | null;
  authors: Person[];
  categories: { id: string; name: string }[];
}

export interface PublicationCategory {
  id: string;
  name: string;
}

export interface ChannelMember {
  userId: string;
  role: AccessRole;
  name: string;
  avatarUrl: string | null;
}

export interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  workspaceId: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  members?: ChannelMember[];
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  isPublic: boolean;
  parentKnowledgeBaseId: string | null;
  createdAt: string;
  updatedAt: string;
  members?: {
    userId: string;
    role: AccessRole;
    name: string;
    avatarUrl: string | null;
  }[];
  workspaceId?: string; // This might be needed for context
}

export interface KnowledgePage {
  id: string;
  title: string;
  content: any | null;
  contentJson: any | null;
  knowledgeBaseId: string;
  authorId: string;
  lastEditorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Whiteboard {
  id: string;
  name: string;
  content: any | null;
  ownerId: string;
  parentWhiteboardId: string | null;
  createdAt: string;
  updatedAt: string;
  members?: {
    userId: string;
    role: AccessRole;
    name: string;
    avatarUrl: string | null;
  }[];
}

export interface LeadForm {
  id: string;
  name: string;
  fields: any;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  sourceProjectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  templateData: any;
  createdAt: string;
  updatedAt: string;
}

export interface TimeLog {
  id: string;
  userId: string;
  taskId: string;
  duration: number;
  description: string | null;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  projectId: string;
  roleId: string;
  isGuest: boolean;
  roleName: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ProjectRole {
  id: string;
  name: string;
  projectId: string;
  permissions: Permission[];
}