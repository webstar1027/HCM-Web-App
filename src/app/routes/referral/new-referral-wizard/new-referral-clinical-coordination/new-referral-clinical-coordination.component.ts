import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Lookup, ReferralDemographics } from '@app/core/models';
import { LookupService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { isBoolean } from 'util';
import { PagedSearchResultModel } from '@app/core/models/paged-search-results.model';
import { PhysicianModel } from '@app/core/models/physician-model';
import { NgForm } from '@angular/forms';
import { ChartPhysician } from '@app/core/models/interfaces/chart/IChart';


@Component({
  selector: 'app-new-referral-clinical-coordination',
  templateUrl: './new-referral-clinical-coordination.component.html'
})
export class NewReferralClinicalCoordinationComponent implements OnInit {
  @Input() newReferral: ReferralDemographics;
  @ViewChild('referralCoordinationClinicalForm') form: NgForm;
  
  dayCareList: Lookup[];
  genderPreference: Lookup[];
  coordinatorsList: Lookup[];
  languagesList: Lookup[];
  otherGenderPreferenceAcceptance: Lookup[];
  transportationLevelLookup: Lookup[];
  evacuationZoneLookup: Lookup[];
  evacuationLocationLookup: Lookup[];
  asyncSelected: string;
  typeaheadLoading: boolean = false;
  noResults: boolean = false;
  pagedSearchResults: PagedSearchResultModel<PhysicianModel>;
  selectedPhysicians: ChartPhysician[];
  physicians: any = [];
  currentPage = 1;
  maxNumberOfPages = 2;


  
  constructor(
    private lookupService: LookupService
  ) { }
  
  onSearchTextChanged(e: any): void {
    if (this.isAlphaNumCheck(e) === false) {
      return;
    }
    this.typeaheadLoading = true;
    const searchTerm = e.target.value;
    if (!searchTerm || searchTerm.length <= 0) {
      this.pagedSearchResults = new PagedSearchResultModel();
    }
    this.currentPage = 0;
    this.maxNumberOfPages = 1;
    this.physicians = new Array();
    this.loadPhysicians(searchTerm);
  }

  loadPhysicians(searchTerm: any) {
    if (this.currentPage - 1 === this.maxNumberOfPages) {
      return;
    }
    this.noResults = false;
    this.lookupService
      .getPhysicians(searchTerm, this.currentPage)
      .subscribe(res => {
        console.log(res);
        this.pagedSearchResults = res;
        this.currentPage = res.currentPage + 1;
        this.maxNumberOfPages = res.totalPages;
        // if (!this.physicians) {
        //   this.physicians = new Array();
        // }

        if (res.data && res.data.length > 0) {
          const newData = res.data;
          this.physicians = this.physicians.concat(newData);
          console.log(this.physicians)
          this.typeaheadLoading = false;
        } else{
          this.noResults = true;
          this.typeaheadLoading = false;
        }
      });
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  selectPhysician(p): void {
    let chartPhysician = {} as ChartPhysician;
    chartPhysician.physician = p;
    if(!this.selectedPhysicians) this.selectedPhysicians = new Array();
    this.selectedPhysicians.push(chartPhysician);
    this.asyncSelected = '';
    console.log('Selected value: ', p);
  }

  setPrimaryPhysician(i){
    this.selectedPhysicians.forEach(phys=>phys.isPrimary = false);
    this.selectedPhysicians[i].isPrimary = true;
  }

  removePhysician(i){
    this.selectedPhysicians.splice(i, 1)
  }
  
  isAlphaNumCheck(e: any): boolean {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode === 8) {
      return true;
    }

    let keynum;
    let keychar;
    const charcheck = /[a-zA-Z0-9]/;
    if (window.event) {
      // IE
      keynum = e.keyCode;
    } else {
      if (e.which) {
        // Netscape/Firefox/Opera
        keynum = e.which;
      } else {
        return true;
      }
    }

    keychar = String.fromCharCode(keynum);
    return charcheck.test(keychar);
  }


  ngOnInit() {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.DayCareLookupService).subscribe(e => {
      this.dayCareList = e;
    });

    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.GenderPreferenceLookupService).subscribe(e => {
      this.genderPreference = e;
    });

    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.OtherGenderAcceptanceLookupService).subscribe(e => {
      this.otherGenderPreferenceAcceptance = e;
    });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.LanguageLookupService)
      .subscribe(e => {
        this.languagesList = e;
      });

    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.CoordinatorLookupService)
      .subscribe(e => {
        this.coordinatorsList = e;
      });

      this.newReferral.isPDN = false;

      this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.TransportationLevelLookupService)
      .subscribe(e => {
        this.transportationLevelLookup = e;
      });

    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.EvacuationZoneLookupService)
      .subscribe(e => {
        this.evacuationZoneLookup = e;
      });

    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.EvacuationLocationLookupService)
      .subscribe(e => {
        this.evacuationLocationLookup = e;
      });
      
  }


}
