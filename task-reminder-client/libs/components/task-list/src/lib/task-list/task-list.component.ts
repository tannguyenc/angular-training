import { IUpdateDone, ITaskReminderDetail, IAddTaskReminder } from './../../../../../datas/task-reminder';
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
    this._task = value.sort((a, b) => { return a.dueDate.getTime() - b.dueDate.getTime(); });
  }

  get tasks(): ITaskReminderDetail[] | [] {
    return this._task;
  }

  @Output() onUpdateDone: EventEmitter<IAddTaskReminder> = new EventEmitter();

  ref: DynamicDialogRef | undefined;

  constructor(private confirmationService: ConfirmationService, private dialogService: DialogService) { }

  // ngOnInit(): void {
  // }

  isDone(task: ITaskReminderDetail, isDone: boolean) {
    let message = 'Are you sure that you want mark as undone?';
    let header = 'Mark as undone';
    if (isDone) {
      message = 'Are you sure that you want to mark as done?';
      header = 'Mark as done';
    }
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        const doneTask = {
          id: task.id,
          isDone: isDone,
          googleTaskListId: task.googleTaskListId,
          isGoogleTask: task.isGoogleTask,
          name: task.name,
          description: task.description,
          dueDate: task.dueDate,
          userId: 0
        } as IAddTaskReminder;

        this.onUpdateDone.emit(doneTask);
      }
    });
  }

  openTaskDetail(task: ITaskReminderDetail) {
    const taskDetail = {
      ...task,
      dueTime: task.dueDate,
      isDone: task.done
    };
    this.ref = this.dialogService.open(AddOrUpdateTaskComponent, {
      data: taskDetail,
      header: 'Update Task Reminder',
      width: '40%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });
  }
}
