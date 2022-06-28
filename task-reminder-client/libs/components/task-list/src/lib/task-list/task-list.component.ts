import { IUpdateDone, ITaskReminderDetail } from './../../../../../datas/task-reminder';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddOrUpdateTaskComponent } from 'libs/pages/home/src/lib/home/add-or-update-task/add-or-update-task.component';

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

  ref: DynamicDialogRef | undefined;

  constructor(private confirmationService: ConfirmationService, private dialogService: DialogService) { }

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

  openTaskDetail(task: ITaskReminderDetail) {
    this.ref = this.dialogService.open(AddOrUpdateTaskComponent, {
      data: task,
      header: 'Update Task Reminder',
      width: '50%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });
  }
}
