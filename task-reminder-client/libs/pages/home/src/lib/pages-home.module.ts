import { PageHomeRoutes } from './pages-home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './home/tasks/tasks.component';
import { TaskDetailComponent } from './home/task-detail/task-detail.component';
import { AddOrUpdateTaskComponent } from './home/add-or-update-task/add-or-update-task.component';

@NgModule({
  imports: [CommonModule, PageHomeRoutes],
  declarations: [
    HomeComponent,
    TasksComponent,
    TaskDetailComponent,
    AddOrUpdateTaskComponent,
  ],
})
export class PagesHomeModule {}
