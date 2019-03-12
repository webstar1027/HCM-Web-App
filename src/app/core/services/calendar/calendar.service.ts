import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Configuration } from "../../configuration";
import { Lookup } from "../../models/lookup";
import { LookupService } from "../components/lookup-service";
import { Validator } from "../../helper/validator";
import { ChartMasterSchedule } from "@app/core/models/interfaces/chart/IChartMasterSchedule";
import { isSameDay, isSameMonth, addHours } from 'date-fns';

@Injectable()
export class CalendarService {
  constructor(
    private http: HttpClient,
    private config: Configuration,
    private helperService: LookupService,
    private validator: Validator
  ) {
    console.log("Instance has been created");
  }


  public getPatientCalendar(chartId: string, date: string = '2018-11-09'): Observable<any> {
    const calendarApiUrl = `${this.config.ApiBaseUrl}` + 'api/scheduling/chart/' + chartId + '/getCalendarMonth/' + date;
    return this.http.get<any>(calendarApiUrl);
  }
  public getPatientVisit(chartId: string, scheduleId): Observable<any> {
    const visitApiUrl = `${this.config.ApiBaseUrl}` + 'api/scheduling/chart/' + chartId + '/schedule/' + scheduleId;
    return this.http.get<any>(visitApiUrl);
  }

  public getLookup(lookup: string): Observable<any> {
    const lookupURL = `${this.config.ApiBaseUrl}` + 'api/Lookup/' + lookup;
    return this.http.get<any>(lookupURL);
  }

  public setVisit(visit:any): Observable<any> {
    const visitApiUrl = `${this.config.ApiBaseUrl}` + 'api/scheduling/chart/' + visit.chartId + '/schedule';
    return this.http.post<any>(visitApiUrl,visit);
  }

  postMasterSchedule(chartId:number, masterSchedule:ChartMasterSchedule): Observable<any> {
    const model = masterSchedule
    // {};
    const url = `${this.config.ApiBaseUrl}api/scheduling/chart/${chartId}/masterSchedule`;
    return this.http.post<any>(url,model);
  }




  // public lookupScheduleValues(): Observable<any> {
  //   const lookupURL = `${this.config.ApiBaseUrl}` + 'api/Lookup/ScheduleViewModelStatusEnum';
  //   return this.http.get<any>(lookupURL);
  // }

  // public lookupEmployeeTypesValues(): Observable<any> {
  //   const lookupURL = `${this.config.ApiBaseUrl}` + 'api/Lookup/EmployeeTypesLookupService';
  //   return this.http.get<any>(lookupURL);
  // }

  // public lookupServiceTypesValues(): Observable<any> {
  //   const lookupURL = `${this.config.ApiBaseUrl}` + 'api/Lookup/ServiceCodeLookupService';
  //   return this.http.get<any>(lookupURL);
  // }

  public getStatusColor(status): string {
    if (status === 1) {
      return 'orange'
    }
    else if (status === 2) {
      return 'silver'
    }
    else if (status === 3) {
      return 'grey'
    }
    else if (status === 4) {
      return 'green'
    }
    else {
      return 'silver'
    }

  }

  getMetadata(start: Date, patientDemographics: any): any {
    const patientName = patientDemographics.firstName + " " + patientDemographics.lastName;
    return {
      patientName: patientName,
      "chartScheduleId": patientDemographics.chartScheduleId,
      "chartId": patientDemographics.chartId,
      "duration": 1,
      "startDateTime": start,
      "endDateTime": addHours(start, 1),
      "visitSpan": "01:00:00",
      "employeeId": 0,
      "serviceCodeId": 0,
      "employeeName": "",
      "serviceCode": "",
      "status": -1,
      "clusterCare": false,
      "mutualVisit": false,
      "manualVisit": true,
      "modifiedVisit": false,
      "missed": false,
      "billed": false,
      "confirmed": false,
      "color": ""

    }
  }



}
