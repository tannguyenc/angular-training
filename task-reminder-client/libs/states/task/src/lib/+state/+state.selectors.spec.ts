import { StateEntity } from './+state.models';
import {
  stateAdapter,
  StatePartialState,
  initialState,
} from './+state.reducer';
import * as StateSelectors from './+state.selectors';

describe('State Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getStateId = (it: StateEntity) => it.id;
  const createStateEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as StateEntity);

  let state: StatePartialState;

  beforeEach(() => {
    state = {
      state: stateAdapter.setAll(
        [
          createStateEntity('PRODUCT-AAA'),
          createStateEntity('PRODUCT-BBB'),
          createStateEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('State Selectors', () => {
    it('getAllState() should return the list of State', () => {
      const results = StateSelectors.getAllState(state);
      const selId = getStateId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = StateSelectors.getSelected(state) as StateEntity;
      const selId = getStateId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getStateLoaded() should return the current "loaded" status', () => {
      const result = StateSelectors.getStateLoaded(state);

      expect(result).toBe(true);
    });

    it('getStateError() should return the current "error" state', () => {
      const result = StateSelectors.getStateError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
