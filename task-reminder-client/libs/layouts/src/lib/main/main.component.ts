import { Component } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'task-reminder-client-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  msgs: Message[] = [];

}
