import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { ReferralDemographics } from "../../../../core/models";
import { BsModalRef } from "ngx-bootstrap";
import { ToasterService } from "angular2-toaster";
import { ReferralService } from "../../../../core/services/referral/referral.service";

@Component({
  templateUrl: "./medicaid-edit.component.html"
})
export class MedicaidEditComponent implements OnInit {
  public onClose: Subject<ReferralDemographics>;
  referralDemographics: ReferralDemographics;
  referralId: number;
  patient: boolean;
  today = new Date();
  aLongTimeAgo = new Date();
  savingInfo:boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private toasterService: ToasterService,
    private referralService: ReferralService
  ) {
    this.onClose = new Subject();
    this.aLongTimeAgo.setFullYear(this.aLongTimeAgo.getFullYear()-120);
  }

  cancel(): void {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }

  save() {
    this.savingInfo = true;
    this.referralService
      .updateMedicadMedicareInformation(
        this.referralId,
        this.referralDemographics
      )
      .subscribe(
        e => {
          this.savingInfo = false;
          this.onClose.next(e.data);
          this.bsModalRef.hide();
        },
        e => {
          this.savingInfo = false;
          this.toasterService.pop("error", "Update Failed", e.message);
        }
      );
  }

  ngOnInit(): void {

  }
}
