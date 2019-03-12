import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReferralDemographics } from "../../../../core/models/referral/referral-demographics";
import { ReferralEnrollmentModel } from "../../../../core/models/referral/referral-enrollment";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ReferralEnrollmentComponent } from "../../partials/referral-enrollment/referral-enrollment.component";
import { IntakeEditComponent } from "../../partials/intake-edit/intake-edit.component";
import { ToasterService } from "angular2-toaster";
import { ReferralAssessment } from "../../../../core/models/referral/referral-assessment";
import { ReferralAssessmentComponent } from "../../partials/referral-assessment/referral.assessment.component";
import { PatientService } from "@app/core/services";
import { ChartAuthorization } from "@app/core/models/interfaces/chart/IChartAuthorization";
import { AuthorizationEditComponent } from "@app/routes/patient/profile/contracts/authorization-edit/authorization-edit.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  templateUrl: "./referral-intake.component.html"
})
export class ReferralIntakeComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  referralEnrollments: ReferralEnrollmentModel[];
  private modalRef: BsModalRef;
  authorizationList: ChartAuthorization[] = [];

  constructor(
    private currentRoute: ActivatedRoute,
    private referralService: ReferralService,
    public dialog: MatDialog,
    private patientService: PatientService,
    private modalService: BsModalService,
    private toasterService: ToasterService
  ) {}

  private loadReferralEnrollments(): void {
    this.referralService
      .getReferralEnrollmentList(this.referralDemographics.referralId)
      .subscribe(e => {
        this.referralEnrollments = e;
        if(this.referralEnrollments.length > 0)this.referralService.getReferralAuthorizations(this.referralDemographics.referralId)
        .subscribe(res=>{
          this.authorizationList = res.data;
        });
      });
  }

  private loadAssessmentList(): void {
    this.referralService
      .getAssessmentList(this.referralDemographics.referralId)
      .subscribe(
        result => {
          this.referralDemographics.referralAssessments = result;
        },
        error => {
          this.toasterService.pop(
            "error",
            "Error Loading Assessment",
            error.exception
          );
        }
      );
  }

  createEnrollment(): void {
    this.editEnrollment(null);
  }

  createAssessment(): void {
    this.editAssessment(null);
  }

  editAssessment(assessment: ReferralAssessment) {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      referralAssessment: JSON.parse(JSON.stringify(assessment))
    };

    this.modalRef = this.modalService.show(ReferralAssessmentComponent, {
      initialState: initialState,
      class: "modal-md"
    });
    this.modalRef.content.onClose.subscribe(result => {
      if (!result) {
        return;
      }
      if (!assessment || assessment.assessmentId < 1) {
        this.referralDemographics.referralAssessments.push(result);
      } else {
        const findAssessmentByIndex = this.referralDemographics.referralAssessments.findIndex(
          e => e.referralAssessmentId === result.referralAssessmentId
        );
        if (findAssessmentByIndex > -1) {
          this.referralDemographics.referralAssessments[
            findAssessmentByIndex
          ] = result;
        }
      }
    });
  }

  editEnrollment(referralEnrollment: ReferralEnrollmentModel) {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      referralEnrollment: JSON.parse(JSON.stringify(referralEnrollment))
    };

    this.modalRef = this.modalService.show(ReferralEnrollmentComponent, {
      initialState: initialState,
      class: "modal-md"
    });

    this.modalRef.content.onClose.subscribe(s => {
      if (!s) {
        return;
      }
      if (!referralEnrollment) {
        this.referralEnrollments.push(s);
      } else {
        const editedReferralEnrollmentIndex = this.referralEnrollments.findIndex(
          iEnrollment => iEnrollment.enrollmentId === s.enrollmentId
        );
        if (editedReferralEnrollmentIndex > -1) {
          this.referralEnrollments[editedReferralEnrollmentIndex] = s;
        }
      }
    });
  }

  editIntakeInfo(): void {
    const initialState = {
      referralId: this.referralDemographics.referralId,
      referralDemographics: JSON.parse(
        JSON.stringify(this.referralDemographics)
      )
    };
    this.modalRef = this.modalService.show(IntakeEditComponent, {
      initialState,
      class: "modal-md"
    });
    this.modalRef.content.onClose.subscribe(result => {
      if (!result) {
        return;
      }
      this.referralDemographics = result;
    });
  }

  openAuthModal(auth?:ChartAuthorization){
    const clonedAuth = !auth ? null :JSON.parse(JSON.stringify(auth)) as ChartAuthorization;
    let authDialogRef = this.dialog.open(AuthorizationEditComponent, {
      data: {
        auth: clonedAuth,
        chartId : this.referralDemographics.chartId,
        referralEnrollments: this.referralEnrollments,
        referral: true
      }
    });
    authDialogRef.afterClosed()
    .subscribe(result => {
      console.log(result)
      if(result == undefined || !result.isSuccess) return;
      const indexOfAuth = this.authorizationList.findIndex(
        e => e.chartAuthorizationId === result.data.chartAuthorizationId
      )
      if(indexOfAuth>=0)this.authorizationList[indexOfAuth] = result.data;
      else this.authorizationList.push(result.data)
    })
  }


  ngOnInit(): void {
    this.currentRoute.parent.data.subscribe(e => {
      this.referralDemographics = e.referral;
      this.loadReferralEnrollments();
      this.loadAssessmentList();
    });
  }
}
