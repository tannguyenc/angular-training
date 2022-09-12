import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';
import * as UserActions from '@task-reminder-client/states/user';
import * as UserSelectors from '@task-reminder-client/states/user';

declare let google: any;

@Component({
  selector: 'task-reminder-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isRing = false;
  activeTask$ = this.store.select(StateSelectors.getStateIsSuccess).subscribe(isSucccess => {
    this.isRing = isSucccess;
    if (this.isRing) {
      setTimeout(() => {
        this.store.dispatch(StateActions.IsSuccessTaskSuccess({ isSuccess: false }));
      }, 1000);
    }
  });

  avatarUrl = localStorage.getItem("photoUrl");
  fullname = localStorage.getItem("fullname");

  constructor(private router: Router, private store: Store) { }

  ngOnInit(): void { }

  logOut() {
    localStorage.removeItem('token');
    localStorage.setItem('userId', '0');
    localStorage.setItem('photoUrl', '');
    localStorage.setItem('fullname', '');
    google.accounts.id.disableAutoSelect();
    this.store.dispatch(UserActions.SetCallTokenFalse({ callToken: 0 }));
    this.router.navigate(['/login']);
  }
}
