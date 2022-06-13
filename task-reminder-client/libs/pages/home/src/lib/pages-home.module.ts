import { PageHomeRoutes } from './pages-home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    PageHomeRoutes
  ],
  declarations: [HomeComponent],
})
export class PagesHomeModule {}
