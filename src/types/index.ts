export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
}

export enum TaskPriority {
  NONE = "NONE",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum EpicStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED",
}

export enum TaskLinkType {
  RELATES_TO = "RELATES_TO",
  BLOCKS = "BLOCKS",
  IS_BLOCKED_BY = "IS_BLOCKED_BY",
}

export enum ActivityActionType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_DELETED = "TASK_DELETED",
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  USER_JOINED = "USER_JOINED",
  COMMENT_ADDED = "COMMENT_ADDED",
}

export enum WorkflowActionType {
  UPDATE_TASK_STATUS = "UPDATE_TASK_STATUS",
  CREATE_TASK = "CREATE_TASK",
  SEND_NOTIFICATION = "SEND_NOTIFICATION",
  ASSIGN_USER = "ASSIGN_USER",
  ADD_COMMENT = "ADD_COMMENT",
}

export enum WidgetType {
  STATS_COUNTER = "STATS_COUNTER",
  TASK_LIST = "TASK_LIST",
  BURNDOWN_CHART = "BURNDOWN_CHART",
  TIME_TRACKING_REPORT = "TIME_TRACKING_REPORT",
  CHART = "CHART",
  TABLE = "TABLE",
}

export enum SocialProvider {
  GOOGLE = "GOOGLE",
  LINKEDIN = "LINKEDIN",
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK",
  NEXTCLOUD = "NEXTCLOUD",
  TELEGRAM = "TELEGRAM",
  GITHUB = "GITHUB",
  WEBSITE = "WEBSITE",
  OTHER = "OTHER",
}

export enum CustomFieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  SELECT = "SELECT",
}

export enum NotificationType {
  SYSTEM_BROADCAST = "SYSTEM_BROADCAST",
  TASK_ASSIGNMENT = "TASK_ASSIGNMENT",
  COMMENT_MENTION = "COMMENT_MENTION",
  PROJECT_INVITE = "PROJECT_INVITE",
}

export enum NotificationSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ViewType {
  KANBAN = "KANBAN",
  LIST = "LIST",
  CALENDAR = "CALENDAR",
  GANTT = "GANTT",
}

export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface ViewColumn {
  id: string;
  name: string;
  order: number;
}

export interface View {
  id: string;
  name: string;
  type: ViewType;
  columns: ViewColumn[];
}
