import { IAddTaskReminder } from './../../../../../../datas/task-reminder';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateActions from '@task-reminder-client/states/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as StateSelectors from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-add-or-update-task',
  templateUrl: './add-or-update-task.component.html',
  styleUrls: ['./add-or-update-task.component.scss'],
})
export class AddOrUpdateTaskComponent implements OnInit {
  loading$ = this.store.select(StateSelectors.getStateLoadedUpdateOrAdd);

  googleTaskList$ = this.store.select(StateSelectors.getGoogleTaskList).pipe(
    map(googleTaskList => {
      return Object.keys(googleTaskList).map((key: any) => {
        return {
          id: googleTaskList[key].id,
          title: googleTaskList[key].title
        }
      });
    })
  );

  minimumDate = new Date();
  taskForm: FormGroup;

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
      isGoogleTask: [{ value: false, disabled: false }],
      googleTaskListId: [{ value: '', disabled: false }],
    });
    this.store.dispatch(StateActions.googleTaskList());
  }

  ngOnInit() {
    const currentTask = this.config.data as IAddTaskReminder;
    if (currentTask !== undefined && currentTask.id !== '0') {
      this.taskForm.controls['isGoogleTask'].disable();
      this.taskForm.controls['googleTaskListId'].disable();
      this.taskForm.patchValue(currentTask);
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

    const isGoogleTask = this.taskForm.controls['isGoogleTask'].value;
    const googleTaskListId = this.taskForm.controls['googleTaskListId'].value;
    if (isGoogleTask === true && googleTaskListId === '') {
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
      userId: this.getCurrentUserId(),
      isGoogleTask: isGoogleTask,
      googleTaskListId: googleTaskListId
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
