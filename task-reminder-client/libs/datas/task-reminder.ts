export enum TaskReminderStatus {
  All = 0,
  Today = 10,
  Overdue = 20,
  Completed = 30,
  Upcoming = 40
}

export interface GetTaskReminderRequest {
  status: TaskReminderStatus;
  userId: number;
}

export interface ITaskResponse {
  day: Date;
  nameDay: string;
  tasks: ITaskReminderDetail[];
}

export interface ITaskReminderDetail {
  id: string;
  name: string;
  nameDay: string;
  description: string;
  created: Date;
  dueDate: Date;
  done: boolean;
  deleted: boolean;
  isGoogleTask: boolean;
  googleTaskListId: string;
  // [key: string]: any;
}

export interface IUpdateDone {
  id: number;
  isDone: boolean;
}

export interface IGoogleCalendarTaskListItem {
  id: string;
  title: string;
}

export interface IAddTaskReminder {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  userId: number;
  googleTaskListId: string;
  isGoogleTask: boolean;
  isDone: boolean;
}

export interface ITaskReminderDetailRequest {
  id: string;
  googleTaskListId: string;
  isGoogleTask: boolean;
}

export interface ITaskReminderDetailResponse {
  id: string;
}
