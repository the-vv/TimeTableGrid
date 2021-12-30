import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Class 1', url: '/folder/Class-1', icon: 'paper-plane' },
    { title: 'Class 2', url: '/folder/Class-2', icon: 'paper-plane' },
    { title: 'Class 3', url: '/folder/Class-3', icon: 'paper-plane' },
    { title: 'Class 4', url: '/folder/Class-4', icon: 'paper-plane' },
    { title: 'Class 5', url: '/folder/Class-5', icon: 'paper-plane' },
    { title: 'Class 6', url: '/folder/Class-6', icon: 'paper-plane' },
  ];
  constructor() {}
}
