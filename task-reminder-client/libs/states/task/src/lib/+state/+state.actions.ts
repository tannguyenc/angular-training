import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { StateEntity } from './+state.models';
import { IAddTaskReminder, ITaskReminderDetail, TaskReminderStatus } from './../../../../../datas/task-reminder';

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
  props<{ id: number, isDone: boolean }>()
);

export const updateDoneTaskSuccess = createAction(
  '[State/API] Update Done task success',
  props<{ task: ITaskReminderDetail }>()
);

export const updateDoneTaskFailure = createAction(
  '[State/API] Update Done task failure',
  props<{ error: HttpErrorResponse }>()
);

export const AddTask = createAction(
  '[State/API] Add task',
  props<{ task: IAddTaskReminder }>()
);

export const AddTaskSuccess = createAction(
  '[State/API] Add task success',
  props<{ task: ITaskReminderDetail }>()
);

export const AddTaskFailure = createAction(
  '[State/API] Add task failure',
  props<{ error: HttpErrorResponse }>()
);

export const UpdateTask = createAction(
  '[State/API] Update task',
  props<{ task: IAddTaskReminder }>()
);

export const UpdateTaskSuccess = createAction(
  '[State/API] Update task success',
  props<{ task: ITaskReminderDetail }>()
);

export const UpdateTaskFailure = createAction(
  '[State/API] Update task failure',
  props<{ error: HttpErrorResponse }>()
);
