import { NgModule } from '@angular/core';
import { LayoutRoutes } from './layouts.routing';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';
import { LeftMenuComponent } from './main/left-menu/left-menu.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {ScrollPanelModule} from 'primeng/scrollpanel';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    ButtonModule,
    MessagesModule,
    DynamicDialogModule,
    MessageModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollPanelModule
  ],
  declarations: [MainComponent, HeaderComponent, LeftMenuComponent],
  exports: [MainComponent],
  providers: [
    DialogService,
    MessageService
  ]
})
export class LayoutsModule { }
