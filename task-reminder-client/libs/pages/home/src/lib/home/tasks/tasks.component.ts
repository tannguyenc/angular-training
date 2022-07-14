import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IUpdateDone, TaskReminderStatus } from './../../../../../../datas/task-reminder';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  activeTabs: boolean[] = [true, false, false];
  tasks$ = this.store.select(StateSelectors.getAllStateNotCompleted).pipe(
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
          order: nameDay === 'Today' ? 0 :
            nameDay === 'Upcoming' ? 1 : 2
        };
        return task;
      }
      ).sort((a, b) => { return a.order - b.order; });

      return arrGroupByDay;
    })
  )

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.All }));
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }

  onTabClose(event: any) {
    this.activeTabs[event.index] = false;
  }

  onTabOpen(event: any) {
    this.activeTabs[event.index] = true;
  }

}
