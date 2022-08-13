import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import * as StateActions from '@task-reminder-client/states/task';

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

  constructor(private router: Router, private store: Store) { }

  ngOnInit(): void { }

  logOut() {
    localStorage.removeItem('token');
    localStorage.setItem('userId', '0');
    localStorage.setItem('photoUrl', '');
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/login']);
  }
}
