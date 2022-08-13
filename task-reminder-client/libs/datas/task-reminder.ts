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
  id: number;
  name: string;
  nameDay: string;
  description: string;
  created: Date;
  dueDate: Date;
  done: boolean;
  deleted: boolean;
  isGoogleTask: boolean;
  // [key: string]: any;
}

export interface IUpdateDone {
  id: number;
  isDone: boolean;
}

export interface IAddTaskReminder {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  userId: number;
}
