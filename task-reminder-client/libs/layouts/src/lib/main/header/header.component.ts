import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  activeTask$ = this.store.select(StateSelectors.getStateIsSuccess).pipe(
    map(activeTask => {
      console.log(activeTask);
      return activeTask;
    }));

  constructor(private router: Router, private store: Store) { }

  ngOnInit(): void { }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
