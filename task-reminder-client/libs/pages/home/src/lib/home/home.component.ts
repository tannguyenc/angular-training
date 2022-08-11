import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as StateSelectors from '@task-reminder-client/states/task';
import { map } from 'rxjs';

@Component({
  selector: 'task-reminder-client-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
  }
}
