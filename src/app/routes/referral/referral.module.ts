import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

//#region  " Internal Modules "

import { SharedModule } from "../../shared/shared.module";

//#endregion

//#region   " Internal Services "

import { LookupService } from "../../core/services/components/lookup-service";
import { AddressManagementService } from "../../core/services/components/address-management.service";
import { ReferralService } from "../../core/services/referral/referral.service";
import { ReferralDemographicsResolver } from "../../core/resolvers/referral/referral-demographics.resolver";

//#endregion

//#region "Components

import { ReferralListComponent } from "./list/referral-list.component";
import { ReferralProfileComponent } from "./profile/referral-profile.component";
import { ReferralDemographicsComponent } from "./profile/demographics/referral-demographics.component";
import { ReferralIntakeComponent } from "./profile/intake/referral-intake.component";
import { ReferralCoordinationComponent } from "./profile/coordination/referral-coordination.component";
import { ReferralClinicalComponent } from "./profile/clinical/referral-clinical.component";
import { ReferralWorkflowComponent } from "./profile/workflow/referral-workflow.component";
import { ReferralEnrollmentComponent } from "./partials/referral-enrollment/referral-enrollment.component";
import { IntakeEditComponent } from "./partials/intake-edit/intake-edit.component";
import { ReferralAssessmentComponent } from "./partials/referral-assessment/referral.assessment.component";
import { NewReferralWizardComponent } from './new-referral-wizard/new-referral-wizard.component';
import { NotesResolver } from "@app/core/resolvers/notes/notes.resolver";
import { NoteService } from "@app/core/services";
import { NewReferralEmergencyContactsComponent } from "./new-referral-wizard/new-referral-emergency-contacts/new-referral-emergency-contacts.component";
import { NewReferralAboutContactComponent } from './new-referral-wizard/new-referral-about-contact/new-referral-about-contact.component';
// import { ReferralStepperComponent } from './new-referral-wizard/referral-stepper/referral-stepper.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NewReferralMedicaidIntakeComponent } from './new-referral-wizard/new-referral-medicaid-intake/new-referral-medicaid-intake.component';
import { NewReferralClinicalCoordinationComponent } from './new-referral-wizard/new-referral-clinical-coordination/new-referral-clinical-coordination.component';
import { ExcelExportService, CsvExportService } from '../../core/services';
import { PdfExportService } from '../../core/services/components/pdf-export.service';
import { CanDeactivateGuard } from "@app/core/guards/wizard/can-deactivate.guard";
import { DialogService } from "@app/core/guards/guard-dialog.service";
import { NgDragDropModule } from "ng-drag-drop";
import { DndModule } from 'ng2-dnd';
//#endregion
const routes: Routes = [
  { path: "list", component: ReferralListComponent },
  { path: "newReferralWizard",
    component: NewReferralWizardComponent,
    canDeactivate: [CanDeactivateGuard] },
  { path: "", redirectTo: "list", pathMatch: "full" },
  {
    path: "profile/:id",
    resolve: { referral: ReferralDemographicsResolver },
    component: ReferralProfileComponent,
    children: [
      { path: "", redirectTo: "demographics", pathMatch: "full" },
      { path: "demographics", component: ReferralDemographicsComponent },
      { path: "intake", component: ReferralIntakeComponent },
      { path: "coordination", component: ReferralCoordinationComponent },
      { path: "clinical", component: ReferralClinicalComponent },
      { path: "workflow", component: ReferralWorkflowComponent },
      {
        path: "notes",
        loadChildren: "../notes/note.module#NoteModule",
        data: { linkType: "Referral" },
        resolve: {notes: NotesResolver}
      },
      {
        path: "documents",
        loadChildren: "../documents/documents.module#DocumentsModule",
        data: { linkType: "Referral" }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ArchwizardModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot()

  ],
  providers: [
    LookupService,
    AddressManagementService,
    ReferralService,
    ReferralDemographicsResolver,
    NotesResolver,
    NoteService,
    CanDeactivateGuard,
    DialogService,
    ExcelExportService,
    CsvExportService,
    PdfExportService
  ],
  declarations: [
    ReferralListComponent,
    ReferralWorkflowComponent,
    ReferralProfileComponent,
    ReferralIntakeComponent,
    ReferralCoordinationComponent,
    ReferralClinicalComponent,
    ReferralDemographicsComponent,
    ReferralEnrollmentComponent,
    IntakeEditComponent,
    ReferralAssessmentComponent,
    NewReferralWizardComponent,
    NewReferralEmergencyContactsComponent,
    NewReferralAboutContactComponent,
    NewReferralMedicaidIntakeComponent,
    NewReferralClinicalCoordinationComponent
  ],
  entryComponents: [
    ReferralEnrollmentComponent,
    IntakeEditComponent,
    ReferralAssessmentComponent,
    NewReferralWizardComponent
  ]
})
export class ReferralModule {}
