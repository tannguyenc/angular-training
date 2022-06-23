import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as StateActions from './+state.actions';
import { StateEffects } from './+state.effects';

describe('StateEffects', () => {
  let actions: Observable<Action>;
  let effects: StateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        StateEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(StateEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: StateActions.init() });

      const expected = hot('-a-|', {
        a: StateActions.loadStateSuccess({ state: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
