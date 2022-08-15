import { IUpdateDone, TaskReminderStatus, IAddTaskReminder } from './../../../../../../datas/task-reminder';
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
  loading$ = this.store.select(StateSelectors.getStateLoaded);
  tasks$ = this.store.select(StateSelectors.getAllState).pipe(
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
          count: groupByDay[key].length,
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

  onUpdateDone(task: IAddTaskReminder) {
    this.store.dispatch(StateActions.updateDoneTask({ task }));
  }
}
