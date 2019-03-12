import { Component, OnInit } from "@angular/core";
import { ReferralAssessment } from "../../../../core/models/referral/referral-assessment";
import { BsModalRef } from "ngx-bootstrap";
import { ToasterService } from "angular2-toaster";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { Subject } from "rxjs/Subject";
import { Lookup } from "../../../../core/models/lookup";
import { LookupService } from "../../../../core/services/components/lookup-service";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";

@Component({
  templateUrl: "./referral.assessment.component.html"
})
export class ReferralAssessmentComponent implements OnInit {
  referralAssessment: ReferralAssessment;
  referralId: number;
  assessmentStatuses: Lookup[];
  insuranceLookupList: Lookup[];
  public onClose: Subject<ReferralAssessment>;
  savingInfo: boolean = false;

  ngOnInit(): void {
    if (!this.referralAssessment) {
      this.referralAssessment = new ReferralAssessment();
    }
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.AssessmentStatusLookupService)
      .subscribe(
        result => {
          this.assessmentStatuses = result;
        },
        failed => {
          this.toasterService.pop("error", "Couldn't load Statues", failed);
        }
      );

    this.lookupService
      .getEnumNameValueLookup(
        LookupTypesEnum.ReferralAssessmentInsuranceLookupService,
        this.referralId.toString()
      )
      .subscribe(
        result => {
          this.insuranceLookupList = result;
        },
        failed => {
          this.toasterService.pop(
            "error",
            "Couldn't load insurance list",
            failed
          );
        }
      );
  }

  ConvertString(val: string): number {
    return parseFloat(val);
  }

  cancel(): void {
    this.onClose.next(null);
    this.modelRef.hide();
  }
  save(): void {
    this.savingInfo = true;
    this.referralService
      .saveAssessment(this.referralId, this.referralAssessment)
      .subscribe(
        result => {
          this.savingInfo = false;
          this.onClose.next(result);
          this.modelRef.hide();
        },
        failure => {
          this.savingInfo = false;
          this.toasterService.pop("Error", "Could not save Assessment");
          console.log(failure);
        }
      );
  }

  constructor(
    private modelRef: BsModalRef,
    private toasterService: ToasterService,
    private referralService: ReferralService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
  }
}
