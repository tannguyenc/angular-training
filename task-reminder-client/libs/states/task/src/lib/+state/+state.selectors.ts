import { createFeatureSelector, createSelector } from '@ngrx/store';
import { _STATE_FEATURE_KEY, State, stateAdapter } from './+state.reducer';

// Lookup the 'State' feature state managed by NgRx
export const getStateState = createFeatureSelector<State>(_STATE_FEATURE_KEY);

const { selectAll, selectEntities } = stateAdapter.getSelectors();

export const getStateLoaded = createSelector(
  getStateState,
  (state: State) => state.loaded
);

export const getStateLoadedUpdateOrAdd = createSelector(
  getStateState,
  (state: State) => state.loadedUpdateOrAdd
);

export const getStateIsSuccess = createSelector(
  getStateState,
  (state: State) => state.isSuccess
);

export const getStateError = createSelector(
  getStateState,
  (state: State) => state.error
);

export const getAllState = createSelector(getStateState, (state: State) =>
  selectAll(state).sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getAllStateUpcomingStatus = createSelector(getStateState, (state: State) =>
  selectAll(state).filter(t => !t.done && t.nameDay === "Upcoming").sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getAllStateTodayStatus = createSelector(getStateState, (state: State) =>
  selectAll(state).filter(t => !t.done && t.nameDay === "Today").sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getAllStateOverdueStatus = createSelector(getStateState, (state: State) =>
  selectAll(state).filter(t => !t.done && t.nameDay === "Overdue").sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getAllStateNotCompleted = createSelector(getStateState, (state: State) =>
  selectAll(state).filter(t => !t.done).sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getAllStateCompleted = createSelector(getStateState, (state: State) =>
  selectAll(state).filter(t => t.done).sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); })
);

export const getStateEntities = createSelector(getStateState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getStateState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getStateEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);

export const getGoogleTaskList = createSelector(
  getStateState,
  (state: State) => state.googleTaskLists
);
