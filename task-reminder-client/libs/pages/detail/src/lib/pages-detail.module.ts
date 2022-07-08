import { PageDetailRoutes } from './pages-detail.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
  PageDetailRoutes
],
  declarations: [DetailComponent],
  exports: [DetailComponent]
})
export class PagesDetailModule {}
