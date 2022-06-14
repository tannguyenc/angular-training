import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import("@task-reminder-client/pages/home").then(m => m.PagesHomeModule)
      },
      {
        path: 'detail',
        loadChildren: () => import("@task-reminder-client/pages/detail").then(m => m.PagesDetailModule)
      }
    ]
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
