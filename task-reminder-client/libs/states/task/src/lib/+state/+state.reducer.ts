import { ITaskReminderDetail } from './../../../../../datas/task-reminder';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as StateActions from './+state.actions';

export const _STATE_FEATURE_KEY = 'state';

export interface State extends EntityState<ITaskReminderDetail> {
  selectedId?: string | number; // which State record has been selected
  loaded: boolean; // has the State list been loaded
  error?: string | null; // last known error (if any)
  isSuccess: boolean;
}

export interface StatePartialState {
  readonly [_STATE_FEATURE_KEY]: State;
}

export const stateAdapter: EntityAdapter<ITaskReminderDetail> =
  createEntityAdapter<ITaskReminderDetail>();

export const initialState: State = stateAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  isSuccess: false
});

const stateReducer = createReducer(
  initialState,
  on(StateActions.init, (state) => ({ ...state, loaded: false, isSuccess: false, error: null })),
  on(StateActions.loadStateFailure,
    StateActions.allTaskFailure,
    StateActions.updateDoneTaskFailure,
    StateActions.AddTaskFailure,
    StateActions.UpdateTaskFailure,
    (state, { error }) => ({ ...state, error, loaded: true, isSuccess: false })),
  on(StateActions.allTaskSuccess,
    (state, { tasks }) => stateAdapter.setAll(tasks, { ...state, loaded: true, isSuccess: false })),
  on(StateActions.updateDoneTaskSuccess,
    StateActions.UpdateTaskSuccess,
    (state, { task }) => stateAdapter.updateOne({ id: task.id, changes: task }, { ...state, loaded: true, isSuccess: true })),
  on(StateActions.AddTaskSuccess,
    (state, { task }) => stateAdapter.addOne(task, { ...state, loaded: true, isSuccess: true })),
);

export function reducer(state: State | undefined, action: Action) {
  return stateReducer(state, action);
}
