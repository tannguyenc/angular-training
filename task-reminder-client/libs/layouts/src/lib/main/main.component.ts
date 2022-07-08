import { Component, OnDestroy } from '@angular/core';
import { AddOrUpdateTaskComponent } from 'libs/pages/home/src/lib/home/add-or-update-task/add-or-update-task.component';
// import { DetailComponent } from '@task-reminder-client/pages/detail';
import { Message } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'task-reminder-client-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  msgs: Message[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService) { }


  addTaskReminder() {
    this.ref = this.dialogService.open(AddOrUpdateTaskComponent, {
      header: 'Add Task Reminder',
      width: '40%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
