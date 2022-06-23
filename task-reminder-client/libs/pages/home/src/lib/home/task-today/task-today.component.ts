import { TaskReminderStatus } from './../../../../../../datas/task-reminder';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';

@Component({
  selector: 'task-reminder-client-task-today',
  templateUrl: './task-today.component.html',
  styleUrls: ['./task-today.component.scss'],
})
export class TaskTodayComponent implements OnInit {

  tasks$ = this.store.select(StateSelectors.getAllState);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.Today }));
  }
}
