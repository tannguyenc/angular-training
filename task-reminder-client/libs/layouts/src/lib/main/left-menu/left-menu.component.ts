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

   constructor(private router: Router,) {}

  ngOnInit() {
    this.items = [{
      label: 'All tasks',
      icon: 'pi pi-calendar-plus',
      command: () => {
        this.router.navigate(['/home/all']);
      }
    },
    {
      label: 'Today\'s tasks',
      icon: 'pi pi-calendar',
      command: () => {
        this.router.navigate(['/home/today']);
      }
    },
    {
      label: 'Overdue tasks',
      icon: 'pi pi-calendar-times',
      command: () => {
        this.router.navigate(['/home/overdue']);
      }
    }
    ];
  }
}
