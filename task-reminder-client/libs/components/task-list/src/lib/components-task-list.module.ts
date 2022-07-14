import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list/task-list.component';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    ConfirmDialogModule,
    TagModule
  ],
  declarations: [TaskListComponent],
  exports: [
    TaskListComponent
  ],
  providers: [
    ConfirmationService
  ]
})
export class ComponentsTaskListModule { }
