import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'task-reminder-client-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private router: Router,
  ) {

  }
}
