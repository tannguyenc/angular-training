import { DetailComponent } from './detail/detail.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DetailComponent
  },
];

export const PageDetailRoutes = RouterModule.forChild(routes);
