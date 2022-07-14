import { IUpdateDone, TaskReminderStatus } from './../../../../../../datas/task-reminder';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit {

  tasks$ = this.store.select(StateSelectors.getAllStateCompleted).pipe(
    map(tasks => {

      const groupByDay = tasks.reduce((r, a) => {
        r['nameDay'] = r['nameDay'] || [];
        r['nameDay'].push(a);
        return r;
      }, Object.create([]));

      const arrGroupByDay = Object.keys(groupByDay).map(key => {
        const nameDay = groupByDay[key][0]['nameDay'];
        const task = {
          tasks: groupByDay[key],
          nameDay: nameDay,
          header: `${nameDay} (${groupByDay[key].length})`,
        };
        return task;
      }
      );

      return arrGroupByDay;
    })
  )

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.Completed }));
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }
}
