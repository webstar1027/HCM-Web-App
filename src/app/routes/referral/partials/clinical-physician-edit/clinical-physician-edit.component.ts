import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Subject } from "rxjs/Subject";
import { ToasterService } from "angular2-toaster";
import { ReferralService } from "../../../../core/services/referral/referral.service";

import { LookupService } from "../../../../core/services/components/lookup-service";
import { PhysicianModel } from "../../../../core/models/physician-model";
import { PagedSearchResultModel } from "../../../../core/models/paged-search-results.model";
import { ChartPhysician } from "../../../../core/models/interfaces/chart/IChart";
import { ReferralDemographics } from "../../../../core/models";

@Component({
  templateUrl: "./clinical-physician-edit.component.html"
})
export class ClinicalPhysicianEditComponent implements OnInit {
  referralId: number;
  chartId: number;
  public onClose: Subject<ChartPhysician>;
  referralDemographics: ReferralDemographics;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  pagedSearchResults: PagedSearchResultModel<PhysicianModel>;
  selectedPhysicianId: number;
  physicians: PhysicianModel[];
  currentPage = 1;
  maxNumberOfPages = 2;
  savingInfo:boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
    this.pagedSearchResults = new PagedSearchResultModel();
  }

  save(): void {
    if (!this.selectedPhysicianId || this.selectedPhysicianId <= 0) {
      this.toasterService.pop("error", "Physician not selected");
      return;
    }

    if(this.referralDemographics.chartPhysicians == null){
      this.referralDemographics.chartPhysicians = [];
    }
    const currentPhysicianInChartPhysicians = this.referralDemographics.chartPhysicians.findIndex(
      e => e.physicianId === this.selectedPhysicianId
    );
    if (currentPhysicianInChartPhysicians > -0) {
      this.toasterService.pop(
        "error",
        "Patient already has the selected physician."
      );
      return;
    }
    let chartPhysician: ChartPhysician = new ChartPhysician();
    chartPhysician.physicianId = this.selectedPhysicianId;
    this.savingInfo = true;
    this.referralService
      .saveChartPhysician(this.chartId, chartPhysician)
      .subscribe(
        e => {
          this.savingInfo = false;
          chartPhysician = e;
          this.onClose.next(e);
          this.modalRef.hide();
        },
        f => {
          this.savingInfo = false;
          this.toasterService.pop("error", "Physician not saved", f.message);
          return;
        }
      );
  }
  cancel(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  onSearchTextChanged(e: any): void {
    if (this.isAlphaNumCheck(e) === false) {
      return;
    }
    const searchTerm = e.target.value;
    if (!searchTerm || searchTerm.length <= 0) {
      this.pagedSearchResults = new PagedSearchResultModel();
    }
    this.currentPage = 0;
    this.maxNumberOfPages = 1;
    this.physicians = new Array();
    this.loadPhysicians(searchTerm);
  }

  loadPhysicians(searchTerm: string) {
    if (this.currentPage - 1 === this.maxNumberOfPages) {
      return;
    }
    this.typeaheadLoading = true;
    this.lookupService
      .getPhysicians(searchTerm, this.currentPage)
      .subscribe(res => {
        this.typeaheadLoading = false;
        this.pagedSearchResults = res;
        this.currentPage = res.currentPage + 1;
        this.maxNumberOfPages = res.totalPages;
        if (!this.physicians) {
          this.physicians = new Array();
        }
        if(res.data.length == 0) this.typeaheadNoResults = true;
        if (res.data && res.data.length > 0) {
          this.typeaheadNoResults = false;
          const newData = res.data;
          this.physicians = this.physicians.concat(newData);
        }
      });
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

  ngOnInit(): void {
  }
}
