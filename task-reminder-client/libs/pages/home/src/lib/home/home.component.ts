import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'task-reminder-client-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    console.log('home');
  }
}
