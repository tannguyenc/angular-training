import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { StateEntity } from './+state.models';
import { IAddTaskReminder, ITaskReminderDetail, TaskReminderStatus, IGoogleCalendarTaskListItem } from './../../../../../datas/task-reminder';

export const init = createAction('[State Page] Init');

export const loadStateSuccess = createAction(
  '[State/API] Load State Success',
  props<{ state: StateEntity[] }>()
);

export const loadStateFailure = createAction(
  '[State/API] Load State Failure',
  props<{ error: any }>()
);

export const allTask = createAction(
  '[State/API] All task',
  props<{ request: TaskReminderStatus }>()
);

export const allTaskSuccess = createAction(
  '[State/API] All task success',
  props<{ tasks: ITaskReminderDetail[] }>()
);

export const allTaskFailure = createAction(
  '[State/API] All task failure',
  props<{ error: HttpErrorResponse }>()
);

export const updateDoneTask = createAction(
  '[State/API] Update Done task',
  props<{ task: IAddTaskReminder }>()
);

export const updateDoneTaskSuccess = createAction(
  '[State/API] Update Done task success',
  props<{ task: ITaskReminderDetail }>()
);

export const updateDoneTaskFailure = createAction(
  '[State/API] Update Done task failure',
  props<{ error: HttpErrorResponse }>()
);

export const addTask = createAction(
  '[State/API] Add task',
  props<{ task: IAddTaskReminder }>()
);

export const addTaskSuccess = createAction(
  '[State/API] Add task success',
  props<{ task: ITaskReminderDetail }>()
);

export const addTaskFailure = createAction(
  '[State/API] Add task failure',
  props<{ error: HttpErrorResponse }>()
);

export const updateTask = createAction(
  '[State/API] Update task',
  props<{ task: IAddTaskReminder }>()
);

export const updateTaskSuccess = createAction(
  '[State/API] Update task success',
  props<{ task: ITaskReminderDetail }>()
);

export const updateTaskFailure = createAction(
  '[State/API] Update task failure',
  props<{ error: HttpErrorResponse }>()
);

export const IsSuccessTaskSuccess = createAction(
  '[State/API] Is Success task success',
  props<{ isSuccess: boolean }>()
);

export const googleTaskList = createAction(
  '[State/API] Get Google TaskList'
);

export const googleTaskListSuccess = createAction(
  '[State/API] Get Google TaskList success',
  props<{ googleTaskLists: IGoogleCalendarTaskListItem[] }>()
);

export const googleTaskListFailure = createAction(
  '[State/API] Get Google TaskList failure',
  props<{ error: HttpErrorResponse }>()
);
