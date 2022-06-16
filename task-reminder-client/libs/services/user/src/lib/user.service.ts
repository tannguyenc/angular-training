import { IAuthenticate } from './../../../../datas/user';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient) {
  }

  authenticate(email: string, password: string): Observable<IAuthenticate> {
    const url = `http://localhost:5121/api/User/authorize`;
    return this.http.post<IAuthenticate>(url, {
      email,
      password
    }, httpOptions);
  }
}
