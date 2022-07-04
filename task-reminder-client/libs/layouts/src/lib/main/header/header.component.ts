import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'task-reminder-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void { }

  logOut() {
    this.router.navigate(['/login']);
  }
}
