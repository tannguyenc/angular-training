import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAddTaskReminder, IUpdateDone, TaskReminderStatus } from './../../../../../../datas/task-reminder';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent implements OnInit {
  activeTabs: boolean[] = [true, false, false];
  loading$ = this.store.select(StateSelectors.getStateLoaded);
  tasks$ = this.store.select(StateSelectors.getAllState).pipe(
    map(tasks => {
      const groupByDay = tasks.reduce((r, a) => {
        r[a.nameDay] = r[a.nameDay] || [];
        r[a.nameDay].push(a);
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

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.Upcoming }));
  }

  onUpdateDone(task: IAddTaskReminder) {
    this.store.dispatch(StateActions.updateDoneTask({ task }));
  }

  onTabClose(event: any) {
    this.activeTabs[event.index] = false;
  }

  onTabOpen(event: any) {
    this.activeTabs[event.index] = true;
  }

}
