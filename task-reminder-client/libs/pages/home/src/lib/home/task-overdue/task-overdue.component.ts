import { IUpdateDone, TaskReminderStatus } from './../../../../../../datas/task-reminder';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'task-reminder-client-task-overdue',
  templateUrl: './task-overdue.component.html',
  styleUrls: ['./task-overdue.component.scss'],
})
export class TaskOverdueComponent implements OnInit {

  tasks$ = this.store.select(StateSelectors.getAllState).pipe(
    map(tasks => {

      const groupByDay = tasks.reduce((r, a) => {
        r['nameDay'] = r['nameDay'] || [];
        r['nameDay'].push(a);
        return r;
      }, Object.create([]));

      const arrGroupByDay =  Object.keys(groupByDay).map(key => ({
        tasks: groupByDay[key],
        day: groupByDay[key][0]['dueDate'],
        nameDay: groupByDay[key][0]['nameDay']
      }));

      return arrGroupByDay;
    })
  )

  constructor(private store: Store,
    private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.Overdue }));
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }
}
