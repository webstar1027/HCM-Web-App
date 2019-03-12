import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";

import { ReferralDemographics } from "../../models/referral/referral-demographics";
import {  ReferralService } from "@app/core/services";

@Injectable()
export class ReferralDemographicsResolver
  implements Resolve<Observable<ReferralDemographics>> {
  constructor(private referralService: ReferralService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ReferralDemographics> {
    const chartId = route.params["id"];
    const referral = this.referralService.getByReferralId(chartId);
    return referral;
  }
}
