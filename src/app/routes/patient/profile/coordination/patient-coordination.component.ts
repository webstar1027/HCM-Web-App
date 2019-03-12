import { Component, OnInit } from '@angular/core';
import { ReferralDemographics } from "../../../../core/models";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { ToasterService } from "angular2-toaster";
import { ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { CoordinationEditComponent } from "../../../referral/partials/coordination-edit/coordination-edit.component";
@Component({
    moduleId: module.id,
    selector: 'app-patient-coordination',
    templateUrl: 'patient-coordination.component.html',
    styleUrls: ['patient-coordination.component.scss']
})
export class PatientCoordinationComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  referralId: number;
  private modalRef: BsModalRef;

  editGeneralIntakeInfo(): void {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      referralDemographics: JSON.parse(
        JSON.stringify(this.referralDemographics)
      )
    };

    this.modalRef = this.modalService.show(CoordinationEditComponent, {
      initialState: initialState,
      class: "modal-sm"
    });

    this.modalRef.content.onClose.subscribe(result => {
      if (!result) {
        return;
      }
      this.referralDemographics = result;
    });
  }
  constructor(
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.parent.data.subscribe(r => {
      this.referralDemographics = r.patient;
    });
    this.route.parent.params.subscribe(r => {
      this.referralId = +r.id;
    });
  }
}
