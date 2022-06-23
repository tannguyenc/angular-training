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
      const groupByDay = tasks.reduce((acc, obj) => {
        const key = obj[obj.nameDay];
        if (!acc[obj.nameDay]) {
           acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
     }, {});
      return groupByDay;
    })
  )

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(StateActions.allTask({ request: TaskReminderStatus.All }));
    this.tasks$.subscribe(resp => {
      console.log(resp);
    });
  }

  onUpdateDone(doneTask: IUpdateDone) {
    this.store.dispatch(StateActions.updateDoneTask({ id: doneTask.id, isDone: doneTask.isDone }));
  }
}
