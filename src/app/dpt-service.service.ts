import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timetable } from './timetable';

@Injectable({
  providedIn: 'root'
})
export class DptServiceService {

  classTimeTableList: Timetable[] = [];
  selectedDate: Date = new Date();
  dateChanged$: BehaviorSubject<Date> = new BehaviorSubject(this.selectedDate);

  constructor() {
    const classList = localStorage.getItem('classTimeTableList');
    if (classList !== null) {
      this.classTimeTableList = JSON.parse(classList);
    }
  }

  getClassTimeTableList() {
    return this.classTimeTableList;
  }

  getClassById(classId: string) {
    const daysList = this.classTimeTableList.find(x => x.classId === classId);
    const alldays = this.classTimeTableList.filter(x => x.classId === classId);
    // return todays timeable only
    const selectedDateClass = alldays.find(
      x => new Date(x.date).getDate() === new Date(this.selectedDate).getDate() &&
        new Date(x.date).getMonth() === new Date(this.selectedDate).getMonth() &&
        new Date(x.date).getFullYear() === new Date(this.selectedDate).getFullYear()
    );
    return selectedDateClass;
  }

  saveClass(timetable: Timetable) {
    const existing = this.classTimeTableList.find(x => x.classId === timetable.classId && this.isSameDay(x.date, timetable.date));
    if (existing) {
      const index = this.classTimeTableList.indexOf(existing);
      this.classTimeTableList[index] = timetable;
    } else {
      this.classTimeTableList.push(timetable);
    }
    localStorage.setItem('classTimeTableList', JSON.stringify(this.classTimeTableList));
  }

  checkAlreadyAssigned(period: number, tid: string, classId: string) {
    const todaysClasses = this.classTimeTableList.filter(
      x => new Date(x.date).getDate() === new Date(this.selectedDate).getDate() &&
        new Date(x.date).getMonth() === new Date(this.selectedDate).getMonth() &&
        new Date(x.date).getFullYear() === new Date(this.selectedDate).getFullYear()
    );
    // console.log(todaysClasses);
    const alreadyAssigned = todaysClasses.filter(x => x.allocation[period] === tid);
    if (alreadyAssigned.length > 0) {
      return true;
    }
    return false;
  }

  getAllAssignedTeacherForEachPeriodsOfToday(tid: string, currentClassId: string) {
    const todaysClasses = this.classTimeTableList.filter(
      x => new Date(x.date).getDate() === new Date(this.selectedDate).getDate() &&
        new Date(x.date).getMonth() === new Date(this.selectedDate).getMonth() &&
        new Date(x.date).getFullYear() === new Date(this.selectedDate).getFullYear()
    );
    const assignesPeriods = [];
    const assignedClassDetails = [];
    todaysClasses.forEach(x => {
      if (x.classId === currentClassId) {
        return;
      }
      // console.log(x.allocation);
      Object.keys(x.allocation).forEach(key => {
        if (x.allocation[key] === tid) {
          assignesPeriods.push(Number(key));
          assignedClassDetails.push(x);
        }
      });
    });
    return { assignesPeriods, assignedClassDetails };
  }

  isSameDay(date1: Date, date2: Date) {
    return new Date(date1).getDate() === new Date(date2).getDate() &&
      new Date(date1).getMonth() === new Date(date2).getMonth() &&
      new Date(date1).getFullYear() === new Date(date2).getFullYear();
  }

}
