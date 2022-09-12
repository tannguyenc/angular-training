import { UserService } from '@task-reminder-client/services/user';
import { Injectable, NgZone } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap, of } from 'rxjs';

import * as UserActions from './user.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable()
export class UserEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      exhaustMap(({ email, password }) => this.userService.authenticate(email, password).pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('userId', resp.id);
          localStorage.setItem('photoUrl', resp.photoUrl);
          localStorage.setItem('fullname', resp.fullName);
          this.router.navigate(['home']);
        }),
        map(resp => UserActions.loginSuccess({ token: resp.token })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Login failed', detail: error.error });
          return of(UserActions.loginFailure({ error }))
        })
      ))
    )
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginWithGoogle),
      exhaustMap(({ email, fullname, photoUrl, accessToken }) => this.userService.authenticateWithGoogle(email, fullname, photoUrl, accessToken).pipe(
        tap((resp) => {
          this.zone.run(() => {
            if (resp.token) {
              localStorage.setItem('token', resp.token);
              localStorage.setItem('userId', resp.id);
              localStorage.setItem('photoUrl', resp.photoUrl);
              localStorage.setItem('fullname', resp.fullName);
              this.router.navigate(['home']);
            }
          });
        }),
        map(resp => UserActions.loginWithGoogleSuccess({ token: resp.token })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Login failed', detail: error.error });
          return of(UserActions.loginWithGoogleFailure({ error }))
        })
      ))
    )
  );

  //0: init, 1: true, 2: false
  checkCallOAuthGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.checkCallOAuthGoogle),
      exhaustMap(({ email }) => this.userService.checkCallOAuthGoogle(email).pipe(
        map(resp => UserActions.checkCallOAuthGoogleSuccess({ isCallToken: resp ? 1 : 2 })),
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Login failed', detail: error.error });
          return of(UserActions.checkCallOAuthGoogleFailure({ error }))
        })
      ))
    )
  );

  constructor(private readonly actions$: Actions,
    private userService: UserService,
    private router: Router,
    private zone: NgZone,
    private messageService: MessageService) { }
}
