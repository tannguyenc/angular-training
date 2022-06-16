import { PageLoginRoutes } from './pages-login.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatesUserModule } from '@task-reminder-client/states/user';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageLoginRoutes,
    StatesUserModule
  ],
  declarations: [LoginComponent],
  exports: [
    LoginComponent
  ]
})
export class PagesLoginModule {}
