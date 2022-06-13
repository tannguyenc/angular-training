import { LayoutRoutes } from './layouts.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes
  ],
  declarations: [MainComponent],
  exports: [
    MainComponent
  ]
})
export class LayoutsModule { }
