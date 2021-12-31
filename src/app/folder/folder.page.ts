import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Timetable } from '../timetable';
import { DptServiceService } from '../dpt-service.service';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  public folder: string;

  text: string;

  results: number[];

  teacherList = [
    {
      name: 'Mr. Nice',
      subject: 'Math',
      grade: 'A',
      image: 'https://i.pravatar.cc/40?u=1',
      id: 1
    },
    {
      name: 'Narco',
      subject: 'Science',
      grade: 'B',
      image: 'https://i.pravatar.cc/40?u=2',
      id: 2
    },
    {
      name: 'Bombasto',
      subject: 'English',
      grade: 'C',
      image: 'https://i.pravatar.cc/40?u=3',
      id: 3
    },
    {
      name: 'Celeritas',
      subject: 'Math',
      grade: 'D',
      image: 'https://i.pravatar.cc/40?u=4',
      id: 4
    },
    {

      name: 'Magneta',
      subject: 'Science',
      grade: 'E',
      image: 'https://i.pravatar.cc/40?u=5',
      id: 5
    },
    {
      name: 'RubberMan',
      subject: 'English',
      grade: 'F',
      image: 'https://i.pravatar.cc/40?u=6',
      id: 6
    },
    {
      name: 'Dynama',
      subject: 'Math',
      grade: 'G',
      image: 'https://i.pravatar.cc/40?u=7',
      id: 7
    },
    {
      name: 'Dr IQ',
      subject: 'Science',
      grade: 'H',
      image: 'https://i.pravatar.cc/40?u=8',
      id: 8
    },
    {
      name: 'Magma',
      subject: 'English',
      grade: 'I',
      image: 'https://i.pravatar.cc/40?u=9',
      id: 9
    },
    {
      name: 'Tornado',
      subject: 'Math',
      grade: 'J',
      image: 'https://i.pravatar.cc/40?u=10',
      id: 10
    }
  ];

  allocs: any = [];

  timetable: Timetable;

  subs = new Subscription();

  isApp = false;

  dragulaName = `${Math.random()}`;

  nonAllowedDrop: number[] = [];
  tutorAssignedClassDetails: any[] = [];

  dragging = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    public platform: Platform,
    public dptService: DptServiceService,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
    public toastController: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
    this.dragulaService.createGroup(this.dragulaName, {
      moves: (el, container, handle) => handle.className.includes('handles'),
      copy: true,
      accepts: (el, target, source, sibling) => {
        if (!this.timetable.allocation[target.id.split('-')[1]]) {
          return true;
        }
        return false;
      },
      copyItem: (item) => item
    });
    this.subs.add(dragulaService.drop(this.dragulaName)
      .subscribe(({ el, target, source }) => {
        this.dragging = false;
        this.nonAllowedDrop = [];
        const isDropNotAllowed = this.dptService.checkAlreadyAssigned(Number(target?.id.split('-')[1]), el?.id, this.folder);
        if (target && !isDropNotAllowed) {
          this.timetable.allocation[target?.id.split('-')[1]] = el?.id;
        } else if(target) {
          const classesAssigned = this.tutorAssignedClassDetails.filter(item => {
            if (item.allocation[target?.id.split('-')[1]] === el?.id) {
              return true;
            }
            return false;
          });
          this.showWarning(classesAssigned[0].className, Number(target?.id.split('-')[1]) + 1);
        }
      })
    );
    this.subs.add(dragulaService.over(this.dragulaName)
      .subscribe(({ el, container }) => {
        // console.log('over', container);
        container.classList.add('drag-over');
      })
    );
    this.subs.add(dragulaService.out(this.dragulaName)
      .subscribe(({ el, container }) => {
        // console.log('out', container);
        container.classList.remove('drag-over');
      })
    );
    this.subs.add(dragulaService.drag(this.dragulaName)
      .subscribe(({ el, source }) => {
        // console.log('out');
        this.dragging = true;
        const { assignedClassDetails, assignesPeriods } = this.dptService.getAllAssignedTeacherForEachPeriodsOfToday(el?.id, this.folder);
        this.nonAllowedDrop = assignesPeriods;
        this.tutorAssignedClassDetails = assignedClassDetails;
        // console.log(assignedClassDetails);
      })
    );
    if (this.platform.is('mobile')) {
      this.isApp = true;
    } else {
      this.isApp = false;
    }
  }

  async showWarning(className: string, hour: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Already Assigned',
      subHeader: 'Droping here is not alllowed',
      message: `Class '${className}' is already assigned with this tutor on hour ${hour}`,
      buttons: ['OK']
    });
    alert.present();
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.dptService.dateChanged$.subscribe(date => {
      this.getCurrentTimetable();
    });
  }

  getCurrentTimetable() {
    const existing = this.dptService.getClassById(this.folder);
    if (existing) {
      this.timetable = existing;
    } else {
      this.timetable = {
        classId: this.folder,
        className: this.folder,
        hoursCount: 6,
        date: new Date(),
        allocation: {}
      };
    }
  }

  getNthPeriod(n: number) {
    const tid = this.timetable.allocation[n];
    if (tid) {
      const teacher = this.teacherList.find(t => t.id === Number(tid));
      return teacher;
    }
    return null;
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
  }

  deleteItem(n: number) {
    delete this.timetable.allocation[n];
  }

  submitTimeTable() {
    this.timetable.date = this.dptService.selectedDate;
    this.dptService.saveClass(this.timetable);
    this.showMessge(`Time Table Saved for ${this.timetable.className}`);
  }

  async showMessge(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'light'
    });
    toast.present();
  }

}
