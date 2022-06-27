import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { StateEntity } from './+state.models';
import { ITaskReminderDetail, ITaskResponse, TaskReminderStatus } from './../../../../../datas/task-reminder';

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

// export const todayTask = createAction(
//   '[State/API] Today task',
//   props<{ request: TaskReminderStatus }>()
// );

// export const overdueTask = createAction(
//   '[State/API] Overdue task',
//   props<{ request: TaskReminderStatus }>()
// );
