import { NgModule } from '@angular/core';
import { LayoutRoutes } from './layouts.routing';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';
import { LeftMenuComponent } from './main/left-menu/left-menu.component';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';

@NgModule({
  imports: [CommonModule, LayoutRoutes, AvatarModule, AvatarGroupModule, MenuModule, ButtonModule],
  declarations: [MainComponent, HeaderComponent, LeftMenuComponent],
  exports: [MainComponent],
})
export class LayoutsModule {}
