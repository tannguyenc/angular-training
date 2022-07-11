import { UpcomingComponent } from './home/upcoming/upcoming.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './home/tasks/tasks.component';
import { TaskTodayComponent } from './home/task-today/task-today.component';
import { TaskOverdueComponent } from './home/task-overdue/task-overdue.component';
import { AuthGuardService } from '@task-reminder-client/states/user';
import { CompletedComponent } from './home/completed/completed.component';

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
        path: 'upcoming',
        canActivate: [AuthGuardService],
        component: UpcomingComponent
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
      },
      {
        path: 'completed',
        canActivate: [AuthGuardService],
        component: CompletedComponent
      }
    ]
  },
];

export const PageHomeRoutes = RouterModule.forChild(routes);
