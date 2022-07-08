import { IAddTaskReminder, ITaskReminderDetail } from './../../../../datas/task-reminder';
import { TaskReminderStatus } from './../../../../datas/task-reminder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
    private http: HttpClient,
    @Inject('BASE_API') private baseUrl: string
    ) {
  }

  getListTask(status: TaskReminderStatus): Observable<ITaskReminderDetail[]> {
    const url = `${this.baseUrl}api/TaskReminder?request=${status}`;
    return this.http.get<ITaskReminderDetail[]>(url, httpOptions);
  }

  updateDoneTask(id: number, isDone: boolean): Observable<ITaskReminderDetail> {
    const url = `${this.baseUrl}api/TaskReminder/${id}/done?isDone=${isDone}`;
    return this.http.put<ITaskReminderDetail>(url, httpOptions);
  }

  addTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `${this.baseUrl}api/TaskReminder`;
    return this.http.post<ITaskReminderDetail>(url, task, httpOptions);
  }

  updateTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `${this.baseUrl}api/TaskReminder/${task.id}`;
    return this.http.put<ITaskReminderDetail>(url, task, httpOptions);
  }
}
