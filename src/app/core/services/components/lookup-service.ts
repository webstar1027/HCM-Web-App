import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../../configuration";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { Lookup } from "../../models/lookup";
import { PhysicianModel } from "../../models/physician-model";
import { PagedSearchResultModel } from "../../models/paged-search-results.model";

@Injectable()
export class LookupService {
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Configuration) private config: Configuration
  ) {
    this.cahcedLookupList = new Array();
  }

  private cahcedLookupList: any[];

  getEnumNameValueLookup(
    enumTypes: LookupTypesEnum,
    paramValue1?: string,
    paramValue2?: string
  ): Observable<Lookup[]> {
    // In the following method we are doing the following.
    // 1) We check if we have at all list of Cahced Lookup items.
    // 2) We check in the CahcedLookupList if the current lookup has been loaded previously
    // 3) We declare and observable for the user to subsribe to
    // 4) If we found in the cached lookup a the current item we return that item to the Observer and we complete it
    // 5) If the current lookup was not yet fetched from the server, We fetch it from the server and
    // we add it to our local list of Fetched lookups, the we return it to the observer

    // Declare variables to be used
    const paramFilter1 = paramValue1 ? "/" + paramValue1 : "";
    const paramFilter2 = paramValue2 ? "/" + paramValue2 : "";
    const lookupName = LookupTypesEnum[enumTypes];
    const url = `${this.config.ApiBaseUrl}api/Lookup/${lookupName}${paramFilter1}${paramFilter2}`;
    // Check if there are any previously loaded lists
    const hasPreviouslyFetchedLookups =
      this.cahcedLookupList && this.cahcedLookupList.length > 0;
    // Declare a variable to hold the previously fetched lookup item
    let cachedLookup: any = null;
    if (hasPreviouslyFetchedLookups) {
      cachedLookup = cachedLookup = this.cahcedLookupList.find(
        e => e.lookupEnumType === enumTypes
      );
    }
    // Declare an Obseravable which the user should subsribe to
    const lookupObservable = Observable.create(observer => {
      if (hasPreviouslyFetchedLookups && cachedLookup) {
        observer.next(cachedLookup.lookup);
        observer.complete();
      } else {
        this.http.get<Lookup[]>(url).subscribe(e => {
          const newCahcedLookupItem = {
            lookupEnumType: enumTypes,
            lookup: e
          };
          if (!paramValue1 && !paramValue2) {
            this.cahcedLookupList.push(newCahcedLookupItem);
          }

          observer.next(newCahcedLookupItem.lookup);
          observer.complete();
        });
      }
    });

    return lookupObservable;
  }

  getPhysicians(search: string, pageNumber: number): Observable<PagedSearchResultModel<PhysicianModel>> {
    const url = `${this.config.ApiBaseUrl}api/Lookup/physicians/${search}?currentPage=${pageNumber}`;
    return this.http.get<PagedSearchResultModel<PhysicianModel>>(url);
  }

  getDocumentTypes(): Observable<Lookup[]> {
    const url = `${this.config.ApiBaseUrl}api/Documents/getDocumentTypes/1`;
    return this.http.get<Lookup[]>(url);
  }
}
