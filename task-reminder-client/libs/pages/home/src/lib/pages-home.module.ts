import { PageHomeRoutes } from './pages-home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './home/tasks/tasks.component';
import { TaskDetailComponent } from './home/task-detail/task-detail.component';
import { AddOrUpdateTaskComponent } from './home/add-or-update-task/add-or-update-task.component';
import { TaskTodayComponent } from './home/task-today/task-today.component';
import { TaskOverdueComponent } from './home/task-overdue/task-overdue.component';
import { ComponentsTaskListModule } from '@task-reminder-client/components/task-list';
import { StatesTaskModule } from '@task-reminder-client/states/task';

@NgModule({
  imports: [
    CommonModule,
    PageHomeRoutes,
    ComponentsTaskListModule,
    StatesTaskModule
  ],
  declarations: [
    HomeComponent,
    TasksComponent,
    TaskDetailComponent,
    AddOrUpdateTaskComponent,
    TaskTodayComponent,
    TaskOverdueComponent,
  ],
})
export class PagesHomeModule {}
