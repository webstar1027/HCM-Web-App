import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { ReferralDemographics } from "../../../../core/models";
import { BsModalRef } from "ngx-bootstrap";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { ToasterService } from "angular2-toaster";
import { Lookup } from "../../../../core/models/lookup";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";

@Component({
  templateUrl: "./intake-edit.component.html"
})
export class IntakeEditComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  referralStatuses: Lookup[];
  referralSubStatusIsLoading = false;
  referralSourceList: Lookup[];
  referralSubStatusList: Lookup[];
  referredByList: Lookup[];
  savingInfo: boolean = false;

  private onClose: Subject<ReferralDemographics>;

  constructor(
    private modalRef: BsModalRef,
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit(): void {
    this.loadReferralStatus();
    this.loadReferredByList();
    this.loadReferralSourceList();
    if (
      this.referralDemographics.referralSubStatusId &&
      this.referralDemographics.referralSubStatusId > 0
    ) {
      this.loadReferralSubStatus(this.referralDemographics.referralSubStatusId);
    }
  }

  cancel(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  save(): void {
    this.savingInfo = true;
    this.referralService.updateIntakeInfo(this.referralDemographics).subscribe(
      e => {
        this.savingInfo = false;
        this.toasterService.pop("success", "Updated", "Intke has been updated");
        this.onClose.next(this.referralDemographics);
        this.modalRef.hide();
      },
      error => {
        this.savingInfo = false;
        this.toasterService.pop("error", "Error Updaing Intake", error.message);
      }
    );
  }

  onStatusChanged(value): void {
    if (!value) {
      return;
    }
    this.loadReferralSubStatus(value);
  }

  private loadReferralSubStatus(value: any) {
    this.referralSubStatusIsLoading = true;
    this.referralService.getReferralSubStatus(value).subscribe(
      e => {
        this.referralSubStatusList = e;
        this.referralSubStatusIsLoading = false;
      },
      failed => {
        this.referralSubStatusIsLoading = false;
      }
    );
  }

  private loadReferralSourceList(): void {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.ReferralSourceLookupService).subscribe(result => {
      this.referralSourceList = result;
    });
  }

  private loadReferredByList(): void {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.ReferredByLookupService).subscribe(result => {
      this.referredByList = result;
    });
  }

  private loadReferralStatus() {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.ReferralStatusLookupService).subscribe(e => {
      this.referralStatuses = e;
    });
  }

  isReferralDeniedStatus(): boolean {
    if (!this.referralStatuses || this.referralStatuses.length < 1) {
      return false;
    }
    const selectedReason = this.referralStatuses.find(
      e =>
        +e.key === this.referralDemographics.referralStatusId &&
        e.name.toLowerCase() === "denied"
    );
    const isNull = selectedReason !== undefined && selectedReason !== null;
    return isNull;
  }
}
