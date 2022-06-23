export enum TaskReminderStatus {
  All = 0,
  Today = 10,
  Overdue = 20
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
  // [key: string]: any;
}

export interface IUpdateDone {
  id: number;
  isDone: boolean;
}
