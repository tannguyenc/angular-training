import { createAction, props } from '@ngrx/store';
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
