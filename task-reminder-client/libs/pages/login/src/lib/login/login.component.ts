import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as UserActions from '@task-reminder-client/states/user';

@Component({
  selector: 'task-reminder-client-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  private _sub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store
  ) {

  }

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  login() {
    const { email, password } = this.loginForm.value;
    if (!!email && !!password) {
      this.store.dispatch(UserActions.login({ email, password }));
    }
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
