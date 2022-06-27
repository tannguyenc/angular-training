import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITaskResponse, IUpdateDone, TaskReminderStatus, ITaskReminderDetail } from './../../../../../../datas/task-reminder';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {

  tasks$ = this.store.select(StateSelectors.getAllState).pipe(
    map(tasks => {

      const groupByDay = tasks.reduce((r, a) => {
            r[a.dueDate] = r[a.dueDate] || [];
            r[a.dueDate].push(a);
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
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.All }));
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }
}
