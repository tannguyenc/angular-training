import { MessageService } from 'primeng/api';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { TaskService } from '@task-reminder-client/services/task';

import * as StateActions from './+state.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StateEffects {

  getGoogleTaskList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.googleTaskList),
      exhaustMap(() => this.taskService.getGoogleTaskList().pipe(
        map(resp => StateActions.googleTaskListSuccess({ googleTaskLists: { ...resp } })),
        catchError((error: HttpErrorResponse) => of(StateActions.googleTaskListFailure({ error })))
      ))
    )
  );

  getAllTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.allTask),
      exhaustMap(({ request }) => this.taskService.getListTask(request).pipe(
        map(resp => {
          const tasks = resp.map(item => ({
            ...item,
            dueDate: new Date(item.dueDate)
          }));
          return StateActions.allTaskSuccess({ tasks })
        }),
        catchError((error: HttpErrorResponse) => of(StateActions.allTaskFailure({ error })))
      ))
    )
  );

  updateDoneTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.updateDoneTask),
      exhaustMap(({ task }) => this.taskService.updateDoneTask(task).pipe(
        tap(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update task successfully' });
        }),
        map(resp => StateActions.updateDoneTaskSuccess({ task: { ...resp, dueDate: new Date(resp.dueDate) } })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Update task failed', detail: error.error });
          return of(StateActions.updateDoneTaskFailure({ error }))
        })
      ))
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.addTask),
      exhaustMap(({ task }) => this.taskService.addTask(task).pipe(
        tap(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add task successfully' });
        }),
        map(resp => StateActions.addTaskSuccess({ task: { ...resp, dueDate: new Date(resp.dueDate) } })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Add task failed', detail: error.error });
          return of(StateActions.addTaskFailure({ error }))
        })
      ))
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.updateTask),
      exhaustMap(({ task }) => this.taskService.updateTask(task).pipe(
        tap(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update task successfully' });
        }),
        map(resp => StateActions.updateTaskSuccess({ task: { ...resp, dueDate: new Date(resp.dueDate) } })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Update task failed', detail: error.error });
          return of(StateActions.updateTaskFailure({ error }))
        })
      ))
    )
  );

  constructor(private readonly actions$: Actions,
    private taskService: TaskService,
    private messageService: MessageService) { }
}
