import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

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
      image: 'https://i.pravatar.cc/40',
      id: 1
    },
    {
      name: 'Narco',
      subject: 'Science',
      grade: 'B',
      image: 'https://i.pravatar.cc/40',
      id: 2
    },
    {
      name: 'Bombasto',
      subject: 'English',
      grade: 'C',
      image: 'https://i.pravatar.cc/40',
      id: 3
    },
    {
      name: 'Celeritas',
      subject: 'Math',
      grade: 'D',
      image: 'https://i.pravatar.cc/40',
      id: 4
    },
    {

      name: 'Magneta',
      subject: 'Science',
      grade: 'E',
      image: 'https://i.pravatar.cc/40',
      id: 5
    },
    {
      name: 'RubberMan',
      subject: 'English',
      grade: 'F',
      image: 'https://i.pravatar.cc/40',
      id: 6
    },
    {
      name: 'Dynama',
      subject: 'Math',
      grade: 'G',
      image: 'https://i.pravatar.cc/40',
      id: 7
    },
    {
      name: 'Dr IQ',
      subject: 'Science',
      grade: 'H',
      image: 'https://i.pravatar.cc/40',
      id: 8
    },
    {
      name: 'Magma',
      subject: 'English',
      grade: 'I',
      image: 'https://i.pravatar.cc/40',
      id: 9
    },
    {
      name: 'Tornado',
      subject: 'Math',
      grade: 'J',
      image: 'https://i.pravatar.cc/40',
      id: 10
    }
  ];

  allocs: any = [];

  timetable = {
    classId: 0,
    className: 'Class 1',
    hoursCount: 6,
    date: new Date(),
    allocation: null
  };

  subs = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService
  ) {
    dragulaService.createGroup('teachers', {
      moves: (el, container, handle) => handle.className.includes('handles'),
      copy: (el, source) => source.id !== 'scheduleGgrid',
      accepts: (el, target, source, sibling) => true,
      copyItem: (item) => {
        console.log(this.allocs);
        const itemVal = {
          name: item.name,
          subject: item.subject,
          grade: item.grade,
          image: item.image,
          id: item.id
        };
        this.allocs.push(itemVal);
        return itemVal;
      }
    });
    this.subs.add(dragulaService.drop('teachers')
      .subscribe(({ el, target }) => {
        console.log('drag', el);
        if (target.id === 'scheduleGgrid') {
          el.setAttribute('size-lg', '12');
          el.classList.remove('non-dropped');
          el.classList.add('dropped');
        } else {
          el.setAttribute('size-lg', '3');
          el.classList.remove('dropped');
          el.classList.add('non-dropped');
        }
      })
    );
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  dropped() {
    console.log(this.timetable.allocation);
  }

}
