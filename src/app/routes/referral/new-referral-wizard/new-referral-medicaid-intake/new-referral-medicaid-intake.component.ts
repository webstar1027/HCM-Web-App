import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ReferralDemographics, Lookup } from '@app/core/models';
import { ToasterService } from 'angular2-toaster';
import { LookupService, ReferralService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'referral-medicaid-intake',
  templateUrl: './new-referral-medicaid-intake.component.html'
})
export class NewReferralMedicaidIntakeComponent implements OnInit {
  @Input() newReferral: ReferralDemographics;
  @ViewChild('medicaidEditForm') form: NgForm;
  referralStatuses: Lookup[];
  referralSubStatusIsLoading = false;
  referralSourceList: Lookup[];
  referralSubStatusList: Lookup[];
  referredByList: Lookup[];
  today = new Date();
  aLongTimeAgo = new Date();

  constructor(
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private lookupService: LookupService
  ) {
    this.aLongTimeAgo.setFullYear(this.aLongTimeAgo.getFullYear()-120);
  }

  onStatusChanged(value): void {
    if (!value) {
      return;
    }
    this.loadReferralSubStatus(value);
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

  isReferralDeniedStatus(): boolean {
    if (!this.referralStatuses || this.referralStatuses.length < 1) {
      return false;
    }
    const selectedReason = this.referralStatuses.find(
      e =>
        +e.key === this.newReferral.referralStatusId &&
        e.name.toLowerCase() === "denied"
    );
    const isNull = selectedReason !== undefined && selectedReason !== null;
    return isNull;
  }

  ngOnInit() {
    this.loadReferralStatus();
    this.loadReferredByList();
    this.loadReferralSourceList();
    if (
      this.newReferral.referralSubStatusId &&
      this.newReferral.referralSubStatusId > 0
    ) {
      this.loadReferralSubStatus(this.newReferral.referralSubStatusId);
    }
  }

}
