import { Component, OnInit } from "@angular/core";
import { ReferralDemographics } from "../../../../core/models";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { ToasterService } from "angular2-toaster";
import { ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef, TypeaheadMatch } from "ngx-bootstrap";
import { ClinicalPhysicianEditComponent } from "../../partials/clinical-physician-edit/clinical-physician-edit.component";
import { ChartPhysician } from "../../../../core/models/interfaces/chart/IChart";
import { ClinicalInofEditComponent } from "../../partials/clinical-edit/clinical-info-edit.component";

@Component({
  selector: "app-referral-clinical",
  templateUrl: "./referral-clinical.component.html"
})
export class ReferralClinicalComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  modalRef: BsModalRef;
  chartPhysicianIsDeleting = false;
  settingAsDefault = false;
  constructor(
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.parent.data.subscribe(r => {
      this.referralDemographics = r.referral;
      this.loadPhysicians();
    });
  }

  loadPhysicians(): void {
    this.referralService
      .getChartPhysicians(this.referralDemographics.chartId)
      .subscribe(e => (this.referralDemographics.chartPhysicians = e));
  }

  editClinical(): void {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      referralDemographics: JSON.parse(
        JSON.stringify(this.referralDemographics)
      )
    };

    const clinicalInfoEditComponent = this.modalService.show(
      ClinicalInofEditComponent,
      {
        initialState: initialState,
        class: "modal-sm"
      }
    );
    clinicalInfoEditComponent.content.onClose.subscribe(res => {
      if (!res) {
        return;
      }
      this.referralDemographics = res;
    });
  }

  addPhysician(): void {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      chartId: this.referralDemographics.chartId,
      referralDemographics: this.referralDemographics
    };

    this.modalRef = this.modalService.show(ClinicalPhysicianEditComponent, {
      initialState: initialState,
      class: "modal-md"
    });
    this.modalRef.content.onClose.subscribe((result: ChartPhysician) => {
      if (!result) {
        return;
      }
      const findPhysiciansByIndex = this.referralDemographics.chartPhysicians.findIndex(
        e => e.chartPhysicianId === result.chartPhysicianId
      );
      if (findPhysiciansByIndex > -1) {
        this.referralDemographics.chartPhysicians[
          findPhysiciansByIndex
        ] = result;
      } else {
        this.referralDemographics.chartPhysicians.push(result);
      }
    });
  }

  setAsPrimaryPhysician(physician: ChartPhysician) {
    this.settingAsDefault = true;
    if (
      this.referralDemographics.chartPhysicians &&
      this.referralDemographics.chartPhysicians.length > 0
    ) {
      this.referralDemographics.chartPhysicians.forEach(element => {
        element.isPrimary = false;
      });
      physician.isPrimary = true;
    }

    this.referralService
      .setChartPhysicianAsDefault(this.referralDemographics.chartId, physician)
      .subscribe(
        e => {
          this.settingAsDefault = false;
        },
        failure => {
          this.settingAsDefault = false;
        }
      );
  }

  deletePhysician(physician: ChartPhysician) {
    this.chartPhysicianIsDeleting = true;
    this.referralService
      .deleteChartPhysician(
        this.referralDemographics.chartId,
        physician.chartPhysicianId
      )
      .subscribe(
        result => {
          const index = this.referralDemographics.chartPhysicians.indexOf(
            physician,
            0
          );
          if (index > -1) {
            this.referralDemographics.chartPhysicians.splice(index);
          }
          this.chartPhysicianIsDeleting = false;
        },
        failed => {
          this.toasterService.pop(
            "error",
            "Could not Remove physician",
            failed.message
          );
          this.chartPhysicianIsDeleting = false;
        }
      );
  }
}
