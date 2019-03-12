import { Component, OnInit, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Subject } from "rxjs/Subject";
import { ToasterService } from "angular2-toaster";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { ReferralDemographics } from "../../../../core/models";
import { Lookup } from "../../../../core/models/lookup";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";

@Component({
  templateUrl: "./clinical-info-edit.component.html"
})
export class ClinicalInofEditComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  referralId: number;
  public onClose: Subject<ReferralDemographics>;

  transportationLevelLookup: Lookup[];
  evacuationZoneLookup: Lookup[];
  evacuationLocationLookup: Lookup[];
  savingInfo:boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private referralService: ReferralService,
    private lookupService: LookupService,
    private toasterService: ToasterService
  ) {
    this.onClose = new Subject();
  }

  ConvertString(value) {
    return parseFloat(value);
  }
  
  save(): void {
    this.savingInfo = true;
    this.referralService
      .updateClinicalInfo(this.referralDemographics)
      .subscribe(
        result => {
          this.savingInfo = false;
          if (result.success) {
            this.onClose.next(this.referralDemographics);
            this.modalRef.hide();
          }
        },
        error => {
          this.savingInfo = false;
          this.toasterService.pop("error", "Could not update clinical");
        }
      );
  }
  cancel(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  ngOnInit(): void {
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
