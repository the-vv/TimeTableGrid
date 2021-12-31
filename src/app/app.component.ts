import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DptServiceService } from './dpt-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public appPages = [
    { title: 'Class 1', url: '/folder/Class-1', icon: 'paper-plane' },
    { title: 'Class 2', url: '/folder/Class-2', icon: 'paper-plane' },
    { title: 'Class 3', url: '/folder/Class-3', icon: 'paper-plane' },
    { title: 'Class 4', url: '/folder/Class-4', icon: 'paper-plane' },
    { title: 'Class 5', url: '/folder/Class-5', icon: 'paper-plane' },
    { title: 'Class 6', url: '/folder/Class-6', icon: 'paper-plane' },
  ];
  constructor(
    private dptService: DptServiceService,
    private menu: MenuController
  ) {
  }

  dateChange(event: string) {
    this.dptService.selectedDate = new Date(event);
    this.dptService.dateChanged$.next(this.dptService.selectedDate);
    this.menu.close('mainMenu');
  }

  ionViewDidEnter() {
  }

  ngOnInit(): void {
    this.menu.open('mainMenu');
    console.log('ionViewDidEnter');
  }

}
