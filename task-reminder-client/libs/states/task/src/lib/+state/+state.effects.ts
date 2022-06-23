import { catchError, exhaustMap, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { TaskService } from '@task-reminder-client/services/task';

import * as StateActions from './+state.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StateEffects {
  getAllTask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(StateActions.allTask),
    exhaustMap(({ request }) => this.taskService.getListTask(request).pipe(
      map(resp => StateActions.allTaskSuccess({ tasks:  resp})),
      catchError((error : HttpErrorResponse) => of(StateActions.allTaskFailure({ error })))
    ))
  )
);

updateDoneTask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(StateActions.updateDoneTask),
    exhaustMap(({ id , isDone }) => this.taskService.updateDoneTask(id, isDone).pipe(
      map(resp => StateActions.updateDoneTaskSuccess({ task:  resp})),
      catchError((error : HttpErrorResponse) => of(StateActions.updateDoneTaskFailure({ error })))
    ))
  )
);

// getListtask$ = createEffect(() =>
// this.actions$.pipe(
//   ofType(StateActions.allTask),
//   exhaustMap(({status}) => this.taskService.getListTask(status).pipe(
//     map
//   )

//   )
// )

// );

  constructor(private readonly actions$: Actions,
    private taskService: TaskService) {}
}
