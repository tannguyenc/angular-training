import { IAddTaskReminder } from './../../../../../../datas/task-reminder';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateActions from '@task-reminder-client/states/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'task-reminder-client-add-or-update-task',
  templateUrl: './add-or-update-task.component.html',
  styleUrls: ['./add-or-update-task.component.scss'],
})
export class AddOrUpdateTaskComponent implements OnInit {
  minimumDate = new Date();
  taskForm: FormGroup;
  isAdd = true;

  constructor(
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private store: Store
  ) {
    this.taskForm = this.formBuilder.group({
      id: ['0', Validators.required],
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      dueTime: [new Date(), Validators.required],
      isDone: [false],
      isGoogleTask: [false],
      googleTaskListId: [''],
    });
  }

  ngOnInit() {
    const currentTask = this.config.data as IAddTaskReminder;
    if (currentTask?.id !== '0') {
      this.taskForm.patchValue(currentTask);
      this.isAdd = false;
    }
  }

  get f() {
    return this.taskForm.controls;
  }

  cancelAddTask() {
    this.ref.close();
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }
    const dueDate = this.taskForm.controls['dueDate'].value;
    const dueTime = this.taskForm.controls['dueTime'].value;

    const dueDateValue = new Date(dueDate);
    const dueTimeValue = new Date(dueTime);

    dueDateValue.setHours(dueTimeValue.getHours());
    dueDateValue.setMinutes(dueTimeValue.getMinutes());

    const form = {
      ...this.taskForm.value,
      dueDate: dueDateValue,
      userId: this.getCurrentUserId()
    };

    if (this.taskForm.value?.id !== '0') {
      this.store.dispatch(StateActions.updateTask({ task: form }));
    } else {
      this.store.dispatch(StateActions.addTask({ task: form }));
    }
    this.ref.close();
  }

  getCurrentUserId() {
    const userId = 0;
    const userIdLocal = localStorage.getItem("userId");
    if (userIdLocal !== null && userIdLocal) {
      return +userIdLocal;
    }
    return userId;
  }
}
