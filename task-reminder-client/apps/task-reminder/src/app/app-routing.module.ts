import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import("@task-reminder-client/pages/login").then(m => m.PagesLoginModule)
  },
  {
    path: '',
    loadChildren: () => import("@task-reminder-client/layouts").then(m => m.LayoutsModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
