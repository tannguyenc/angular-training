import { IAuthenticate } from './../../../../datas/user';
import { Inject, Injectable } from '@angular/core';
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
    private http: HttpClient,
    @Inject('BASE_API') private baseUrl: string
    ) {
  }

  authenticate(email: string, password: string): Observable<IAuthenticate> {
    const url = `${this.baseUrl}api/User/authorize`;
    return this.http.post<IAuthenticate>(url, {
      email,
      password
    }, httpOptions);
  }

  authenticateWithGoogle(email: string, fullname: string, photoUrl: string, accessToken: string): Observable<IAuthenticate> {
    const url = `${this.baseUrl}api/User/authorize/google`;
    return this.http.post<IAuthenticate>(url, {
      email,
      fullname,
      photoUrl,
      accessToken
    }, httpOptions);
  }
}
