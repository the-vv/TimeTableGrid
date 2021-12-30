import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Timetable } from '../timetable';
import { DptServiceService } from '../dpt-service.service';


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

  allowedDrops: number[] = [];

  dragging = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    public platform: Platform,
    public dptService: DptServiceService
  ) {
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
        this.allowedDrops = [];
        if (target) {
          this.timetable.allocation[target?.id.split('-')[1]] = el?.id;
        }
        console.log(this.dptService.checkAlreadyAssigned(Number(target?.id.split('-')[1]), el?.id, this.folder));
        // console.log(this.timetable);
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
        console.log('out');
        this.dragging = true;
        this.allowedDrops = this.dptService.getAllAssignedTeacherForEachPeriodsOfToday(el?.id, this.folder);
      })
    );
    if (this.platform.is('mobile')) {
      this.isApp = true;
    } else {
      this.isApp = false;
    }
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    const existing = this.dptService.getClassById(this.folder);
    if (existing) {
      this.timetable = existing;
    } else {
      this.timetable = {
        classId: this.folder,
        className: 'Class 1',
        hoursCount: 4,
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
    this.dptService.saveClass(this.timetable);
  }

}
