import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromState from './+state/+state.reducer';
import { StateEffects } from './+state/+state.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromState._STATE_FEATURE_KEY, fromState.reducer),
    EffectsModule.forFeature([StateEffects]),
  ],
})
export class StatesTaskModule {}
