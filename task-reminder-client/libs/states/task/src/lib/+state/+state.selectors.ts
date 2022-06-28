import { createFeatureSelector, createSelector } from '@ngrx/store';
import { _STATE_FEATURE_KEY, State, stateAdapter } from './+state.reducer';

// Lookup the 'State' feature state managed by NgRx
export const getStateState = createFeatureSelector<State>(_STATE_FEATURE_KEY);

const { selectAll, selectEntities } = stateAdapter.getSelectors();

export const getStateLoaded = createSelector(
  getStateState,
  (state: State) => state.loaded
);

export const getStateError = createSelector(
  getStateState,
  (state: State) => state.error
);

export const getAllState = createSelector(getStateState, (state: State) =>
  selectAll(state)
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

// export const getAllTasks = createSelector(
//   getStateState,
//   (state: State) => lodash.groupBy(state.tasks, 'dueDate')
//   );

// export const getAllTasks = createSelector(
//   getStateState,
//   (state: State) => from(state.tasks).pipe(
//     groupBy(t => t.dueDate),
//     mergeMap(group => group
//       .pipe(
//         reduce((taskOnDay, cur) => {
//           const toDay = new Date().setUTCHours(0,0,0,0);
//           const dayTask = group.key.setUTCHours(0,0,0,0);
//           taskOnDay.nameDay = dayTask < toDay ? "Overdue" : dayTask == toDay ? "Today" : "Upcoming";
//           taskOnDay.tasks.push(cur);
//             return taskOnDay;
//           },
//           {
//             day: group.key,
//             nameDay: group.key.getDay().toString(),
//             tasks: []
//           } as ITaskResponse
//         )
//       )
//     ),
//     toArray()
//   ).subscribe(t=>{
//     state.allTaskResponse = t
//   }));
