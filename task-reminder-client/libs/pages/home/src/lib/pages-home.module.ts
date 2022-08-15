import { PageHomeRoutes } from './pages-home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './home/tasks/tasks.component';
import { TaskDetailComponent } from './home/task-detail/task-detail.component';
import { AddOrUpdateTaskComponent } from './home/add-or-update-task/add-or-update-task.component';
import { TaskTodayComponent } from './home/task-today/task-today.component';
import { TaskOverdueComponent } from './home/task-overdue/task-overdue.component';
import { ComponentsTaskListModule } from '@task-reminder-client/components/task-list';
import { StatesTaskModule } from '@task-reminder-client/states/task';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DatePipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CompletedComponent } from './home/completed/completed.component';
import { UpcomingComponent } from './home/upcoming/upcoming.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TreeTableModule} from 'primeng/treetable';

@NgModule({
  imports: [
    CommonModule,
    PageHomeRoutes,
    ComponentsTaskListModule,
    StatesTaskModule,
    ConfirmDialogModule,
    InputTextModule,
    CalendarModule,
    FormsModule,
    HttpClientModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    AccordionModule,
    ProgressSpinnerModule,
    TreeTableModule,
  ],
  declarations: [
    HomeComponent,
    TasksComponent,
    TaskDetailComponent,
    AddOrUpdateTaskComponent,
    TaskTodayComponent,
    TaskOverdueComponent,
    CompletedComponent,
    UpcomingComponent,
  ],
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class PagesHomeModule {}
