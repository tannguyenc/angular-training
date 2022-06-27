import { IUpdateDone, ITaskReminderDetail } from './../../../../../datas/task-reminder';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'task-reminder-client-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {

  private _task: ITaskReminderDetail[] = [];

  // @Input() tasks: ITaskResponse[] = [];
  @Input()
  set tasks(value: ITaskReminderDetail[] | []) {
    this._task = value;
  }

  get tasks(): ITaskReminderDetail[] | [] {
    return this._task;
  }

  @Output() onUpdateDone: EventEmitter<IUpdateDone> = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) { }

  // ngOnInit(): void {
  // }

  isDone(id: number, isDone: boolean) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const doneTask = {
          id: id,
          isDone: isDone
        } as IUpdateDone;

        this.onUpdateDone.emit(doneTask);
      }
    });
  }
}
