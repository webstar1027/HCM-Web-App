import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterScheduleDetail, ChartMasterSchedule } from '@app/core/models/interfaces/chart/IChartMasterSchedule';
import { NgForm } from '@angular/forms';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { LookupService, CalendarService } from '@app/core/services';
import { Lookup } from '@app/core/models';
import { weekdays } from 'moment';
import { MatInput, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-master-schedule-modal',
  templateUrl: './master-schedule-modal.component.html',
  styleUrls: ['./master-schedule-modal.component.scss']
})
export class MasterScheduleModalComponent implements OnInit {
  @ViewChild('masterTemplateForm') templateForm: NgForm;
  @ViewChildren('masterWeekForm') weekForm: QueryList<NgForm>;
  @ViewChildren('startTime') startTime: QueryList<ElementRef>;
  @ViewChildren('endTime') endTime: QueryList<ElementRef>;
  weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  masterSchedule = {} as ChartMasterSchedule;
  schedule = {} as MasterScheduleDetail;
  sunday = {} as MasterScheduleDetail;
  monday = {} as MasterScheduleDetail;
  tuesday = {} as MasterScheduleDetail;
  wednesday = {} as MasterScheduleDetail;
  thursday = {} as MasterScheduleDetail;
  friday = {} as MasterScheduleDetail;
  saturday = {} as MasterScheduleDetail;
  daysOfWeek: string[];
  employeeList: any[];
  templateView = true;
  weekView = false;
  timeSpan:any;
  serviceCodeList:  Lookup[];
  weekDaySchedules: any[];
  fullday: boolean;
  tabIndex:number = 0;
  endTimeArr: ElementRef[];
  startTimeArr: ElementRef[];
  weekFormArr: NgForm[];
  savingInfo:boolean = false;

  // chartId:number;

  constructor(
    public dialogRef: MatDialogRef<MasterScheduleModalComponent>,
    private lookup: LookupService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private calendarService: CalendarService,
    public snackBar: MatSnackBar
  ) {
    this.employeeList = data.employees;
    this.masterSchedule.chartId = data.chartId;
    this.masterSchedule.masterScheduleDetails = [];
    if(data.masterSchedule) this.masterSchedule = data.masterSchedule;
   }

  save(){
    if(this.weekView) this.weekFormArr = this.weekForm.toArray();
    if(this.templateView && this.templateForm.invalid){
      return Object.keys(this.templateForm.controls).forEach(key => {
        this.templateForm.controls[key].markAsTouched();
      });
    }
    else if(this.weekView && this.weekFormArr[this.tabIndex].invalid){
      return Object.keys(this.weekFormArr[this.tabIndex].controls).forEach(key => {
        this.weekFormArr[this.tabIndex].controls[key].markAsTouched();
      });
    }
    if(this.daysOfWeek) this.daysOfWeek.forEach(element => {
      this.schedule.dayOfWeek = element;
      this.masterSchedule.masterScheduleDetails.push(this.schedule)
    });
    if(this.weekView){
      this.weekDaySchedules.forEach(el=>{
        if(el.startTime && el.effectiveDate && el.serviceCodeId && el.endTime)this.masterSchedule.masterScheduleDetails.push(el)
      })
    }
    this.savingInfo = true;
    this.calendarService.postMasterSchedule(this.masterSchedule.chartId,this.masterSchedule)
      .subscribe(
        res=>{
          this.savingInfo = false;
          console.log(res)
          if(res.isSuccess){
            this.dialogRef.close(res)
            this.snackBar.open('Master Schedule Saved','',{
              duration: 1000,
            })
          }
            else this.snackBar.open('Error, There was a problem saving the Master Week','',{
              duration: 1000,
            })
        },
        e=>{
          this.savingInfo = false;
          if(!e.isSuccess)this.snackBar.open(`Error, ${e.error.message}`,'',{
            duration: 1700,
          })
        })

  }

  compare(id1:any, id2:any){
    return id1 == id2;
  }

  updateIndex(tab){
    this.tabIndex = tab;
  }

  calculateTimeSpan(){
    if(this.weekView){
      this.startTimeArr = this.startTime.toArray();
      this.endTimeArr = this.endTime.toArray();
      if(this.startTimeArr[this.tabIndex].nativeElement.value && this.endTimeArr[this.tabIndex].nativeElement.value){
        let start = this.startTimeArr[this.tabIndex].nativeElement.value.split(':'), end = this.endTimeArr[this.tabIndex].nativeElement​​.value​​​​​.split(':');
        let startTime = new​ Date(0, 0, 0, parseInt(start[0]), parseInt(start[1])),
        endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]));
        
        // Convert Time Difference to DateTime Object for display
        this.timeSpan = new Date(0,0,0,0,0,0,endTime.getTime() - startTime.getTime());
        console.log(this.timeSpan.getHours())
        if(this.timeSpan.getHours() == 0){
          this.fullday = true;
          this.weekDaySchedules[this.tabIndex].isNextDay = true;
        }
      }
      else this.timeSpan = null;
    }
    else{
      if(this.startTime.first.nativeElement.value && this.endTime.first.nativeElement.value){
        let start = this.startTime.first.nativeElement.value.split(':'), end = this.endTime.first.nativeElement​​.value​​​​​.split(':');
        let startTime = new​ Date(0, 0, 0, parseInt(start[0]), parseInt(start[1])),
        endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]));
        
        // Convert Time Difference to DateTime Object for display
        this.timeSpan = new Date(0,0,0,0,0,0,endTime.getTime() - startTime.getTime());
        console.log(this.timeSpan.getHours())
        if(this.timeSpan.getHours() == 0){
          this.fullday = true;
          this.schedule.isNextDay = true;
        }
      }
      else this.timeSpan = null;
    }
  }

  tabChange(){
    this.calculateTimeSpan();
  }

  changeView(){
    this.templateView = !this.templateView;
    this.weekView = !this.weekView;
    if(this.weekView)this.daysOfWeek = null;
    this.timeSpan = null;
    this.fullday = null;
  }

  ngOnInit() {
    this.lookup.getEnumNameValueLookup(LookupTypesEnum.InsuranceServiceCodesLookupService,'1','0')
    .subscribe(res=>this.serviceCodeList = res);
    this.weekDaySchedules = [this.sunday,this.monday,this.tuesday,this.wednesday,this.thursday,this.friday,this.saturday];
    this.weekDaySchedules.forEach((el,i)=>el.dayOfWeek = this.weekDays[i])
  }

}
