import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from '@app/core/services';
import { EmployeeListModel } from '@app/core/models';
import { ChartContract,ChartAuthorization } from '@app/core/models/interfaces/chart/IChartAuthorization';
import { FormGroup, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-visit-dialog',
  templateUrl: 'visit-dialog.component.html',
  styleUrls: ['visit-dialog.component.scss']
})
export class VisitDialogComponent implements OnInit {
  visitType: string;
  visit: any;
  visitDate: any;
  startTime: string;
  endTime: string;
  isNew: boolean;
  patientDemographics: any;
  scheduleTypes: any;
  employeeTypes: any;
  serviceCodes: any;
  serviceCode: number;
  employees: EmployeeListModel[];
  contractList: ChartContract[];
  authorizationList:ChartAuthorization;

  visitForm = new FormGroup({
    patientCtrl: new FormControl(''),
    employeeCtrl: new FormControl(''),
    dateCtrl: new FormControl(''),
    startCtrl: new FormControl(''),
    endCtrl: new FormControl(''),
    contractCtrl: new FormControl(''),
    serviceCodeCtrl: new FormControl(''),
    statusCtrl: new FormControl(''),
    athorizationCtrl: new FormControl('')
  });

  constructor(
    private calendarService: CalendarService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<VisitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.setInitialValues(data);
  }
  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.visitForm.patchValue({
      "dateCtrl": this.visitDate,
      "startCtrl": this.startTime,
      "endCtrl": this.endTime,
    });

    if (this.isNew) {
      this.patchNewValues();
    }
    else {
      this.patchExisitingValues();
    }
  }

  setInitialValues(data) {
    this.visit = data.event;
    this.isNew = data.isNew;
    this.visitType = data.visitType;
    this.patientDemographics = data.patientDemographics;
    this.scheduleTypes = data.scheduleTypes;
    this.employeeTypes = data.employeeTypes;
    this.serviceCodes = data.serviceCodes;
    this.employees = data.employees;
    this.contractList = data.contractList;
    this.authorizationList = data.authorizationList;
    const dateVal = new Date(this.visit.startDateTime).toISOString();
    this.visitDate = dateVal.slice(0, dateVal.search('T'));
    this.startTime = new Date(this.visit.startDateTime).toISOString();
    this.endTime = new Date(this.visit.endDateTime).toISOString();
    if(this.visitType === "Skilled"){
      this.serviceCodes = this.serviceCodes.filter(serviceCode => serviceCode.additionalData.disciplineCode.code === "RN");
    }
    else{
      this.serviceCodes = this.serviceCodes.filter(serviceCode => serviceCode.additionalData.disciplineCode.code !== "RN");
    }

  }

  patchNewValues(): void {
    this.visit.serviceCodeId = this.serviceCodes[0].key
    this.visitForm.patchValue({
      "patientCtrl": this.patientDemographics.fullName.toString(),
      "employeeCtrl": this.employees[0].employeeId,
      "contractCtrl": this.contractList[0].insuranceId,
      "statusCtrl": this.scheduleTypes[0].key,
      "serviceCodeCtrl": this.visit.serviceCodeId,
    });
  }
  patchExisitingValues(): void {
    this.visitForm.patchValue({
      "patientCtrl": this.patientDemographics.fullName.toString(),
      "employeeCtrl": this.visit.employeeId,
      "dateCtrl": new Date(this.visit.startDateTime),
      "contractCtrl": this.contractList[0].insuranceId,
      "serviceCodeCtrl": this.visit.serviceCode,
      "statusCtrl": this.visit.status.key
    });
  }




  getFieldVal(field): void {
    const val = this.visitForm.get(field);
    this.visitForm.patchValue({ field: val.value });
  }

  getServiceCode(field): void {
    const val = this.visitForm.get(field);
    console.log(val.value)
    this.visit.serviceCode = val.value;
    this.visitForm.patchValue({ field: val.value });
  }

  setVisitDate(field): void {
    const fieldVal = this.visitForm.get(field);
    const dateVal = new Date(fieldVal.value).toISOString();
    this.visitDate = dateVal.slice(0, dateVal.search('T'));
  }

  setStartTime(field) {
    const fieldVal = this.visitForm.get(field);
    this.startTime = this.visitDate + "T" + fieldVal.value;
    this.visitForm.patchValue({ field: fieldVal.value });
  }


  setEndTime(field) {
    const fieldVal = this.visitForm.get(field);
    this.endTime = this.visitDate + "T" + fieldVal.value;
    this.visitForm.patchValue({ field: fieldVal.value });
  }

  save(): void {
    if (this.visitForm.invalid) this.toaster.pop('error', 'The Visit Form is Invalid');
    const vals = this.visitForm.value

    const patientVisit = {
      "chartId": this.visit.chartId,
      "startDateTime": this.startTime,
      "endDateTime": this.endTime,
      "serviceId": vals.serviceCodeCtrl,
      "employeeId": vals.employeeCtrl
    }

    this.calendarService.setVisit(patientVisit).subscribe(
      res => {
        const contract = res;
        this.toaster.pop('success', 'Visit Saved!');
        this.dialogRef.close("Visit Success");
      },
      e => {
        this.toaster.pop('error', 'Error Saving Visit ', e.error);
        this.dialogRef.close("Visit failed");
      }
    )
  }





}