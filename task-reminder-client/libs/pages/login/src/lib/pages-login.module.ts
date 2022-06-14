import { PageLoginRoutes } from './pages-login.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    PageLoginRoutes
  ],
  declarations: [LoginComponent],
  exports: [
    LoginComponent
  ]
})
export class PagesLoginModule {}
