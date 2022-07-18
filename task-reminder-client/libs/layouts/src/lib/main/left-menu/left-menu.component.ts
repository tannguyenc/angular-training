import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'task-reminder-client-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router,) { }

  ngOnInit() {
    this.items = [{
      label: 'All tasks',
      icon: 'pi pi-calendar-times',
      routerLink: ['/home/all'],
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Upcoming tasks',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/home/upcoming'],
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Today\'s tasks',
      icon: 'pi pi-calendar',
      routerLink: ['/home/today'],
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Overdue tasks',
      icon: 'pi pi-calendar-minus',
      routerLink: ['/home/overdue'],
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Completed tasks',
      icon: 'pi pi-check-square',
      routerLink: ['/home/completed'],
      routerLinkActiveOptions: { exact: true },
    }
    ];
  }
}
