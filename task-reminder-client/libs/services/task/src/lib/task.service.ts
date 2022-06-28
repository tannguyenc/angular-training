import { IAddTaskReminder, ITaskReminderDetail, ITaskResponse } from './../../../../datas/task-reminder';
import { TaskReminderStatus } from './../../../../datas/task-reminder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient) {
  }

  getListTask(status: TaskReminderStatus): Observable<ITaskReminderDetail[]> {
    const url = `https://localhost:7121/api/TaskReminder?request=${status}`;
    return this.http.get<ITaskReminderDetail[]>(url, httpOptions);
  }

  updateDoneTask(id: number, isDone: boolean): Observable<ITaskReminderDetail> {
    const url = `https://localhost:7121/api/TaskReminder/${id}/done?isDone=${isDone}`;
    return this.http.put<ITaskReminderDetail>(url, httpOptions);
  }

  addTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `https://localhost:7121/api/TaskReminder`;
    return this.http.post<ITaskReminderDetail>(url, task, httpOptions);
  }

  updateTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `https://localhost:7121/api/TaskReminder/${task.id}`;
    return this.http.put<ITaskReminderDetail>(url, task, httpOptions);
  }
}
