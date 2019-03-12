import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Subject } from "rxjs/Subject";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { ReferralDemographics } from "../../../../core/models";
import { Lookup } from "../../../../core/models/lookup";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { ToasterService } from "angular2-toaster";
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  templateUrl: "./coordination-edit.component.html"
})
export class CoordinationEditComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  referralId: number;
  public onClose: Subject<ReferralDemographics>;
  dayCareList: Lookup[];
  genderPreference: Lookup[];
  coordinatorsList: Lookup[];
  languagesList: Lookup[];
  otherGenderPreferenceAcceptance: Lookup[];
  savingInfo = false;

  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  relationshipList: Lookup[];

  constructor(
    private modalRef: BsModalRef,
    private referralService: ReferralService,
    private lookupService: LookupService,
    private toasterService: ToasterService
  ) {
    this.onClose = new Subject();
  }

  save(): void {
    this.savingInfo = true;
    if (this.referralDemographics.isCDPAS) {
      forkJoin(
        this.referralService.updateCoordinationrInfo(this.referralDemographics),
        this.referralService.updateCDPASInfo(this.referralDemographics)
      )
      .subscribe(
        e => {
          const responses = e;
          this.onClose.next(responses[0]);
          this.modalRef.hide();
        },
        e => {
          this.savingInfo = false;
          console.log(e);
          this.toasterService.pop("error", "Could not save Coordination Info");
        }
      );
    }
    else {
      this.referralService.updateCoordinationrInfo(this.referralDemographics)
      .subscribe(
        e => {
          this.referralDemographics = e;
          this.onClose.next(this.referralDemographics);
          this.modalRef.hide();
        },
        e => {
          this.savingInfo = false;
          console.log(e);
          this.toasterService.pop("error", "Could not save Coordination Info");
        }
      );
    }
    
    
  }
  cancel(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }
  ConvertString(value) {
    return parseFloat(value);
  }

  ngOnInit(): void {
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.DayCareLookupService)
      .subscribe(e => {
        this.dayCareList = e;
      });

    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.GenderPreferenceLookupService)
      .subscribe(e => {
        this.genderPreference = e;
      });

    this.lookupService
      .getEnumNameValueLookup(
        LookupTypesEnum.OtherGenderAcceptanceLookupService
      )
      .subscribe(e => {
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

    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.RelationshipLookupService).subscribe(e => { this.relationshipList = e; });

  }
}
