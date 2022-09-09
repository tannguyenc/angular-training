import { HttpErrorResponse } from '@angular/common/http';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as UserActions from './user.actions';
import { UserEntity } from './user.models';

export const USER_FEATURE_KEY = 'user';

export interface State extends EntityState<UserEntity> {
  selectedId?: string | number; // which User record has been selected
  loaded: boolean; // has the User list been loaded
  error?: HttpErrorResponse | null; // last known error (if any)
  token: string;
  isCallToken: number;
}

export interface UserPartialState {
  readonly [USER_FEATURE_KEY]: State;
}

export const userAdapter: EntityAdapter<UserEntity> =
  createEntityAdapter<UserEntity>();

export const initialState: State = userAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  token: '',
  isCallToken: 0
});

const userReducer = createReducer(
  initialState,
  on(UserActions.login,
    UserActions.loginWithGoogle,
    UserActions.checkCallOAuthGoogle,
    (state) => ({ ...state, loaded: false, isCallToken: 0, error: null })
  ),
  on(UserActions.loginSuccess,
    UserActions.loginWithGoogleSuccess,
    (state, { token }) => {
      const userId = token.split('-').pop();
      //localStorage.setItem('token', token);
      return { ...state, loaded: true, token, userId: userId }
    }),
    on(UserActions.checkCallOAuthGoogleSuccess,
      (state, { isCallToken }) => {
        return { ...state, isCallToken, loaded: true }
      }),
  on(UserActions.loginFailure,
    UserActions.loginWithGoogleFailure,
    UserActions.checkCallOAuthGoogleFailure,
    (state, { error }) => ({ ...state, error, loaded: true })),
    on(UserActions.SetCallTokenFalse,
      (state, { callToken }) => ({ ...state, loaded: true, isCallToken: 0 })),
);

export function reducer(state: State | undefined, action: Action) {
  return userReducer(state, action);
}
