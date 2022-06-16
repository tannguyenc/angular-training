import { UserService } from '@task-reminder-client/services/user';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap, of } from 'rxjs';

import * as UserActions from './user.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      exhaustMap(({ email, password }) => this.userService.authenticate(email, password).pipe(
        tap((resp) => {
          // localStorage.setItem('token', resp.token);
          this.router.navigate(['/home']);
        }),
        map(resp => UserActions.loginSuccess({ token: resp.token })),
        catchError((error: HttpErrorResponse) => {
          return of(UserActions.loginFailure({ error }))
        })
      ))
    )
  );

  constructor(private readonly actions$: Actions,
    private userService: UserService,
    private router: Router,) { }
}
