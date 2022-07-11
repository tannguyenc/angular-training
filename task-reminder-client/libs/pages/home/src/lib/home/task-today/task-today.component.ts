import { IUpdateDone, TaskReminderStatus } from './../../../../../../datas/task-reminder';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-task-today',
  templateUrl: './task-today.component.html',
  styleUrls: ['./task-today.component.scss'],
})
export class TaskTodayComponent implements OnInit {

  tasks$ = this.store.select(StateSelectors.getAllStateTodayStatus).pipe(
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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.Today }));
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }
}
