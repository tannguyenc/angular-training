import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'task-reminder-client-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  items: MenuItem[] = [];

  // constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.items = [{
      label: 'All tasks',
      icon: 'pi pi-calendar-plus',
      command: () => {
        // this.update();
      }
    },
    {
      label: 'Today\'s tasks',
      icon: 'pi pi-calendar',
      command: () => {
        // this.delete();
      }
    },
    {
      label: 'Overdue tasks',
      icon: 'pi pi-calendar-times',
      command: () => {
        // this.delete();
      }
    }
    ];
  }
}
