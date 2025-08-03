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
} from "./api";
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
}

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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
  projectName: string | null;
  taskTypeId?: string | null;
  taskType?: TaskType | null;
  ownerId: string | null;
  creatorId: string | null;
  startDate: string | null;
  dueDate: string | null;
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
  people: Person[];
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
    | "orderInColumn";
  sortOrder?: "asc" | "desc";
  taskOrigin?: "project" | "standalone";
  userRole?: "creator" | "assignee";
}