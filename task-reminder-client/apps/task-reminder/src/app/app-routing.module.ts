import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("@task-reminder-client/layouts").then(m => m.LayoutsModule)
  },
  {
    path: 'login',
    loadChildren: () => import("@task-reminder-client/pages/login").then(m => m.PagesLoginModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
