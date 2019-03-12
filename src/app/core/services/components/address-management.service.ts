import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Configuration } from '../../configuration';
import { CityStateInfo } from '../../models/components/city-state-info-model';


@Injectable()
export class AddressManagementService {

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration
  ) {  }

  public getCityStateByZip(zipCode: string): Observable<CityStateInfo> {
    const url = this.config.ApiBaseUrl + 'api/Address/getCityState/' + zipCode;
    return this.http.get<CityStateInfo>(url);
  }
}
