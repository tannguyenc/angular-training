import { IAddTaskReminder, IGoogleCalendarTaskListItem, ITaskReminderDetail, ITaskReminderDetailRequest, ITaskReminderDetailResponse } from './../../../../datas/task-reminder';
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

    const userId = this.getCurrentUserId();
    const url = `${this.baseUrl}api/TaskReminder?Status=${status}&UserId=${userId}`;
    return this.http.get<ITaskReminderDetail[]>(url, httpOptions);
  }

  updateDoneTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    task = {
      ...task,
      userId: this.getCurrentUserId()
    };
    const url = `${this.baseUrl}api/TaskReminder/${task.id}/done`;
    return this.http.put<ITaskReminderDetail>(url, task, httpOptions);
  }

  addTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `${this.baseUrl}api/TaskReminder`;
    return this.http.post<ITaskReminderDetail>(url, task, httpOptions);
  }

  updateTask(task: IAddTaskReminder): Observable<ITaskReminderDetail> {
    const url = `${this.baseUrl}api/TaskReminder/${task.id}`;
    return this.http.put<ITaskReminderDetail>(url, task, httpOptions);
  }

  getTaskDetail(request: ITaskReminderDetailRequest): Observable<ITaskReminderDetail> {

    const userId = this.getCurrentUserId();
    const url = `${this.baseUrl}api/TaskReminder/${request.id}?UserId=${userId}
    &GoogleTaskListId=${request.googleTaskListId}&IsGoogleTask=${request.isGoogleTask}`;
    return this.http.get<ITaskReminderDetail>(url, httpOptions);
  }

  deleteTask(task: ITaskReminderDetailRequest): Observable<ITaskReminderDetailResponse> {
    const userId = this.getCurrentUserId();
    const url = `${this.baseUrl}api/TaskReminder/${task.id}?UserId=${userId}&GoogleTaskListId=${task.googleTaskListId}&IsGoogleTask=${task.isGoogleTask}`;
    console.log(url);
    return this.http.delete<ITaskReminderDetailResponse>(url, httpOptions);
  }

  getCurrentUserId() {
    const userId = 0;
    const userIdLocal = localStorage.getItem("userId");
    if (userIdLocal !== null && userIdLocal) {
      return +userIdLocal;
    }
    return userId;
  }

  getGoogleTaskList(): Observable<IGoogleCalendarTaskListItem[]> {

    const userId = this.getCurrentUserId();
    const url = `${this.baseUrl}api/TaskReminder/googleTaskList?UserId=${userId}`;
    return this.http.get<IGoogleCalendarTaskListItem[]>(url, httpOptions);
  }
}
