import { ITaskResponse, ITaskReminderDetail } from './../../../../../datas/task-reminder';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as StateActions from './+state.actions';

export const _STATE_FEATURE_KEY = 'state';

export interface State extends EntityState<ITaskReminderDetail> {
  selectedId?: string | number; // which State record has been selected
  loaded: boolean; // has the State list been loaded
  error?: string | null; // last known error (if any)
}

export interface StatePartialState {
  readonly [_STATE_FEATURE_KEY]: State;
}

export const stateAdapter: EntityAdapter<ITaskReminderDetail> =
  createEntityAdapter<ITaskReminderDetail>();

export const initialState: State = stateAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const stateReducer = createReducer(
  initialState,
  on(StateActions.init, (state) => ({ ...state, loaded: false, error: null })),
  on(StateActions.loadStateFailure,
    StateActions.allTaskFailure,
    StateActions.updateDoneTaskFailure,
    StateActions.AddTaskFailure,
    StateActions.UpdateTaskFailure,
    (state, { error }) => ({ ...state, error, loaded: true })),
  on(StateActions.allTaskSuccess,
    (state, { tasks }) => stateAdapter.setAll(tasks, { ...state, loaded: true })),
  on(StateActions.updateDoneTaskSuccess,
    StateActions.UpdateTaskSuccess,
    (state, { task }) => stateAdapter.updateOne({ id: task.id, changes: task }, { ...state, loaded: true })),
  on(StateActions.AddTaskSuccess,
    (state, { task }) => stateAdapter.addOne(task, { ...state, loaded: true })),
);

export function reducer(state: State | undefined, action: Action) {
  return stateReducer(state, action);
}
