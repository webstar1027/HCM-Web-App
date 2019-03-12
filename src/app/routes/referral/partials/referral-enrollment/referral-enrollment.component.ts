import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { ReferralEnrollmentModel } from "../../../../core/models/referral/referral-enrollment";
import { Subject } from "rxjs/Subject";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { Lookup } from "../../../../core/models/lookup";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { ToasterService } from "angular2-toaster";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { NgForm } from "@angular/forms";

@Component({
  templateUrl: "./referral-enrollment.component.html"
})
export class ReferralEnrollmentComponent implements OnInit {
  @ViewChild("enrollmentEditForm") editForm: NgForm;

  public onClose: Subject<ReferralEnrollmentModel>;
  referralEnrollment: ReferralEnrollmentModel;

  referralId: number;
  insuranceList: Lookup[];
  enrollmentStatuses: Lookup[];
  savingInfo: boolean;

  save(): void {
    if (this.referralEnrollment && this.referralEnrollment.enrollmentId > 0) {
      if (
        this.editForm &&
        (this.editForm.touched === false && this.editForm.dirty === false)
      ) {
        this.onClose.next(this.referralEnrollment);
        this.modalRef.hide();
        return;
      }
    }
    this.savingInfo = true;
    this.referralService
      .saveEnrollmentData(this.referralId, this.referralEnrollment)
      .subscribe(
        result => {
          this.savingInfo = false;
          this.onClose.next(result);
          this.modalRef.hide();
        },
        failure => {
          this.savingInfo = false;
          this.toasterService.pop(
            "error",
            "Error saving enrollment",
            failure.error
          );
        }
      );
  }

  cancel(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  loadEnrollmentStatuses(): void {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.ReferralEnrollmentStatusLookupService).subscribe(
      result => {
        this.enrollmentStatuses = result;
      },
      failure => {
        this.toasterService.pop(
          "error",
          "Error Loading Statuses",
          failure.message
        );
      }
    );
  }

  loadInsuranceList() {
    this.helperService
      .getEnumNameValueLookup(LookupTypesEnum.InsuranceLookupService)
      .subscribe(
        e => {
          this.insuranceList = e;
        },
        f => {
          this.toasterService.pop("error", "Couldn't load insurance", f.error);
        }
      );
  }

  constructor(
    private modalRef: BsModalRef,
    private helperService: LookupService,
    private toasterService: ToasterService,
    private referralService: ReferralService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit(): void {
    this.loadInsuranceList();
    this.loadEnrollmentStatuses();
    if (!this.referralEnrollment) {
      this.referralEnrollment = new ReferralEnrollmentModel();
    }
  }
}
