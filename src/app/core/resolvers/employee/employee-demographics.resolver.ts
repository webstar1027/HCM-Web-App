import { Injectable } from "@angular/core";
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Resolve
} from "@angular/router";
import { Observable } from "rxjs/Observable";

import { EmployeeService } from "../../services/human-resources/employee.service";
import { EmployeeDemographicsModel } from "../../models";

@Injectable()
export class EmployeeDemographicsResolver
  implements Resolve<Observable<EmployeeDemographicsModel>> {
  constructor(private employeeService: EmployeeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EmployeeDemographicsModel> {
    const id = +route.paramMap.get("id");
    return this.employeeService.getEmployeeDemographics(id);
  }
}
