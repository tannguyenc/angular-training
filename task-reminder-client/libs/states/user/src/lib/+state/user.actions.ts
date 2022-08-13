import { createAction, props, Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export const login = createAction(
  '[User/API] Login',
  props<{ email: string, password: string }>()
);

export const loginSuccess = createAction(
  '[User/API] Login success',
  props<{ token: string }>()
);

export const loginFailure = createAction(
  '[User/API] Login failure',
  props<{ error: HttpErrorResponse }>()
);

export const loginWithGoogle = createAction(
  '[User/API] Login With Google',
  props<{ email: string, fullname: string, photoUrl: string, accessToken: string }>()
);

export const loginWithGoogleSuccess = createAction(
  '[User/API] Login With Google success',
  props<{ token: string }>()
);

export const loginWithGoogleFailure = createAction(
  '[User/API] Login With Google failure',
  props<{ error: HttpErrorResponse }>()
);

export const checkCallOAuthGoogle = createAction(
  '[User/API] Check Call OAuth Google',
  props<{ email: string }>()
);

export const checkCallOAuthGoogleSuccess = createAction(
  '[User/API] Check Call OAuth Google success',
  props<{ isCallToken: boolean }>()
);

export const checkCallOAuthGoogleFailure = createAction(
  '[User/API] Check Call OAuth Google failure',
  props<{ error: HttpErrorResponse }>()
);
