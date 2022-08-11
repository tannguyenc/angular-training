import { PageLoginRoutes } from './pages-login.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatesUserModule } from '@task-reminder-client/states/user';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';

import {
  SocialLoginModule,
} from '@abacritt/angularx-social-login';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageLoginRoutes,
    StatesUserModule,
    ToastModule,
    SocialLoginModule
  ],
  declarations: [LoginComponent],
  exports: [
    LoginComponent
  ],
  providers: [MessageService,]
})
export class PagesLoginModule {}
