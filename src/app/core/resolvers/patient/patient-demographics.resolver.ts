import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";

import { PatientService } from "@app/core/services";
import { IChart } from "@app/core/models/interfaces/chart/IChart";

@Injectable()
export class PatientDemographicsResolver
  implements Resolve<Observable<IChart>> {
  constructor(private patientService: PatientService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IChart> {
    const chartId = route.params["id"];
    const patient = this.patientService.getByChartId(chartId);
    return patient;
  }
}
