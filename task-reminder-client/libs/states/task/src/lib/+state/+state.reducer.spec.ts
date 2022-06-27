import { Action } from '@ngrx/store';

import * as StateActions from './+state.actions';
import { StateEntity } from './+state.models';
import { State, initialState, reducer } from './+state.reducer';

describe('State Reducer', () => {
  const createStateEntity = (id: string, name = ''): StateEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid State actions', () => {
    it('loadStateSuccess should return the list of known State', () => {
      const state = [
        createStateEntity('PRODUCT-AAA'),
        createStateEntity('PRODUCT-zzz'),
      ];
      const action = StateActions.loadStateSuccess({ state });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
