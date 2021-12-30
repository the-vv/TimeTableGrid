import { Injectable } from '@angular/core';
import { Timetable } from './timetable';

@Injectable({
  providedIn: 'root'
})
export class DptServiceService {

  classTimeTableList: Timetable[] = [];

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
    return this.classTimeTableList.find(x => x.classId === classId);
  }

  saveClass(timetable: Timetable) {
    //update class if existing class id otherwise push
    const existing = this.classTimeTableList.find(x => x.classId === timetable.classId);
    if (existing) {
      const index = this.classTimeTableList.indexOf(existing);
      this.classTimeTableList[index] = timetable;
    } else {
      this.classTimeTableList.push(timetable);
    }
    // this.classTimeTableList.push(timetable);
    // console.log(this.classTimeTableList);
    localStorage.setItem('classTimeTableList', JSON.stringify(this.classTimeTableList));
  }

  checkAlreadyAssigned(period: number, tid: string, classId: string) {
    const todaysClasses = this.classTimeTableList.filter(
      x => new Date(x.date).getDate() === new Date().getDate() &&
        new Date(x.date).getMonth() === new Date().getMonth() &&
        new Date(x.date).getFullYear() === new Date().getFullYear()
    );
    console.log(todaysClasses);
    const alreadyAssigned = todaysClasses.filter(x => x.allocation[period] === tid);
    if (alreadyAssigned.length > 0) {
      return true;
    }
    return false;
  }

  getAllAssignedTeacherForEachPeriodsOfToday(tid: string, currentClassId: string) {
    const todaysClasses = this.classTimeTableList.filter(
      x => new Date(x.date).getDate() === new Date().getDate() &&
        new Date(x.date).getMonth() === new Date().getMonth() &&
        new Date(x.date).getFullYear() === new Date().getFullYear()
    );
    const assignesPeriods = [];
    todaysClasses.forEach(x => {
      if(x.classId === currentClassId) {
        return;
      }
      console.log(x.allocation);
      Object.keys(x.allocation).forEach(key => {
        if (x.allocation[key] === tid) {
          assignesPeriods.push(Number(key));
        }
      });
    });
    return assignesPeriods;
  }

}
