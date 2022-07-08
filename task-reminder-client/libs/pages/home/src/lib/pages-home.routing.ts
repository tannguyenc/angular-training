import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './home/tasks/tasks.component';
import { TaskTodayComponent } from './home/task-today/task-today.component';
import { TaskOverdueComponent } from './home/task-overdue/task-overdue.component';
import { AuthGuardService } from '@task-reminder-client/states/user';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'all',
        canActivate: [AuthGuardService],
        component: TasksComponent
      },
      {
        path: 'today',
        canActivate: [AuthGuardService],
        component: TaskTodayComponent
      },
      {
        path: 'overdue',
        canActivate: [AuthGuardService],
        component: TaskOverdueComponent
      }
    ]
  },
];

export const PageHomeRoutes = RouterModule.forChild(routes);
