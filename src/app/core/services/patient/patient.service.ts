import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Configuration } from "../../configuration";
import { LookupService } from "../components/lookup-service";
import { Validator } from "../../helper/validator";
import { ChartAuthorization } from "@app/core/models/interfaces/chart/IChartAuthorization";

@Injectable()
export class PatientService {
  constructor(
    private http: HttpClient,
    private config: Configuration,
    private helperService: LookupService,
    private validator: Validator
  ) {

  }

  public getPatientList(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const url =
      this.config.ApiBaseUrl +
      `api/charts?pageSize=${pageSize}&page=${currentPage}`;
    return this.http.get<any>(url);
  }

  public getByChartId(chartId: number): Observable<any> {
    const url = this.config.ApiBaseUrl + "api/charts/" + chartId;
    return this.http.get<any>(url);
  }

  getChartContracts(chartId:number): Observable<any> {
    const chartApiUrl = `${this.config.ApiBaseUrl}api/charts/${chartId}/contracts`;
    return this.http.get(chartApiUrl);
  }

  getChartAuthorizations(chartId:number): Observable<any>{
    const chartApiUrl = `${this.config.ApiBaseUrl}api/charts/${chartId}/authorization`;
    return this.http.get(chartApiUrl)
  }

  postChartContract(chartContract): Observable<any>{
    if(chartContract.endDate)chartContract.endDate = chartContract.endDate.toLocaleString('en-US',{ timeZone: 'UTC', hour12: false }).replace(',', '');

    const model = {
      chartContractId: chartContract.chartContractId,
      chartId: chartContract.chartId,
      insuranceId: chartContract.insuranceId,
      effectiveDate: chartContract.effectiveDate.toLocaleString('en-US',{ hour12: false }).replace(',', ''),
      endDate: chartContract.endDate,
      memberId: chartContract.memberId,
      episodeId: chartContract.episodeId
    }
    console.log(model)

    const chartApiUrl = `${this.config.ApiBaseUrl}api/charts/${chartContract.chartId}/contracts`;
    return this.http.post(chartApiUrl, model);
  }

  postChartAuthorizations(chartId, chartAuth):Observable<any>{
    // Reconvert property values to their proper types
     const model = {
      chartAuthorizationId: chartAuth.chartAuthorizationId,
      chartContractId: parseInt(chartAuth.chartContractId),
      enrollmentId: parseInt(chartAuth.enrollmentId),
      authorizationNumber: chartAuth.authorizationNumber,
      verbalAuthorization: chartAuth.verbalAuthorization,
      authorizationDetails: [],
      authorizationNotes: []
    }
    chartAuth.authorizationDetails.forEach(authDets=> {
      const details = {
      authorizationDate : authDets.authorizationDate.toLocaleString('en-US',{ hour12: false }).replace(',', ''),
      startDate : authDets.startDate.toLocaleString('en-US',{ hour12: false }).replace(',', ''),
      endDate : authDets.endDate.toLocaleString('en-US',{ hour12: false }).replace(',', ''),
      weekdaysValue : parseInt(authDets.weekdaysValue),
      insuranceServiceCodeId : parseInt(authDets.insuranceServiceCodeId),
      sunUnits: authDets.sunUnits,
      monUnits: authDets.monUnits,
      tueUnits: authDets.tueUnits,
      wedUnits: authDets.wedUnits,
      thuUnits: authDets.thuUnits,
      friUnits: authDets.friUnits,
      satUnits: authDets.satUnits,
      weekdaysUOM : authDets.weekdaysUOM,
      chartAuthorizationDetailId: authDets.chartAuthorizationDetailId,
      chartAuthorizationId: authDets.chartAuthorizationId,
      terminatedforHospitalization:  authDets.terminatedforHospitalization,
      maxUnitsForAuthorization: authDets.maxUnitsForAuthorization,
      unitType: authDets.unitType,
      period: authDets.period,
      units: authDets.units
      }

      model.authorizationDetails.push(details);
    });

    const chartApiUrl = `${this.config.ApiBaseUrl}api/charts/${chartId}/authorization`;
    return this.http.post(chartApiUrl, model);
  }

  public saveDocument(document: any): Observable<any> {
    const saveDocumentUrl = `${this.config.ApiBaseUrl}api/documents/saveDocument`;
    return this.http.post<any>(saveDocumentUrl, document);
  }

  public saveDocumentLink(model: any, documentId: number): Observable<any> {
    const saveDocumentLink = `${this.config.ApiBaseUrl}api/documents/${documentId}/addLink`;
    return this.http.post<any>(saveDocumentLink, model);
  }

}
