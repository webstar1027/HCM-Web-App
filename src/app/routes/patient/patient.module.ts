import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { AddressManagementService } from "../../core/services/components/address-management.service";
import { ReferralService } from "../../core/services/referral/referral.service";

import { SharedModule } from '../../shared/shared.module';
import { PatientListComponent } from './list/patient-list.component';
import { PatientDemographicsComponent } from './profile/demographics/patient-demographics.component';
import { PatientProfileComponent } from './profile/patient-profile.component';
import { PatientCoordinationComponent } from "./profile/coordination/patient-coordination.component";
import { PatientClinicalComponent } from "./profile/clinical/patient-clinical.component";
import { PatientCalendarComponent } from "./profile/calendar/patient-calendar.component";
import { PatientDocumentsComponent } from "./profile/documents/patient-documents.component";
import { PatientNotesComponent } from "./profile/notes/patient-notes.component";
import { AuthorizationEditComponent } from './profile/contracts/authorization-edit/authorization-edit.component';

import { PatientService, LookupService, CalendarService } from "@app/core/services";


import { NotesResolver } from "@app/core/resolvers/notes/notes.resolver";
import { NoteService } from "@app/core/services";
import { PatientContractsComponent } from "./profile/contracts/patient-contracts.component";
import { PatientContractsEditComponent } from './profile/contracts/patient-contracts-edit/patient-contracts-edit.component';


import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../../shared/components/demo-utils/module';
import { PatientDemographicsResolver } from "@app/core/resolvers/patient/patient-demographics.resolver";
import { VisitDialogComponent } from './profile/calendar/visit-dialog/visit-dialog.component';
import { CalendarDisplayComponent } from './profile/calendar/calendar-display/calendar-display.component';
import { MasterScheduleModalComponent } from './profile/calendar/master-schedule-modal/master-schedule-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSidenavModule, MatListModule } from '@angular/material';


const routes: Routes = [
    { path: "list", component: PatientListComponent },
    { path: "profile/:id",
      component: PatientProfileComponent,
      resolve: { patient: PatientDemographicsResolver },
      children: [
        { path: "", redirectTo: "demographics", pathMatch: "full"},
        { path: "demographics", component: PatientDemographicsComponent },
        { path: "coordination", component: PatientCoordinationComponent },
        { path: "clinical", component: PatientClinicalComponent },
        { path: "calendar", component: PatientCalendarComponent },
        { path: "contracts", component: PatientContractsComponent },
        { path: "documents", loadChildren: "../documents/documents.module#DocumentsModule"},
        { path: "notes",
          loadChildren: "../notes/note.module#NoteModule",
          data: { linkType: "chart" },
          resolve: {notes: NotesResolver}
        }
      ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CalendarModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
      PatientService,
      LookupService,
      AddressManagementService,
      ReferralService,
      CalendarService,
      PatientDemographicsResolver,
      NotesResolver,
      NoteService
  ],
  declarations: [
      PatientListComponent,
      PatientDemographicsComponent,
      PatientProfileComponent,
      PatientCoordinationComponent,
      PatientClinicalComponent,
      PatientCalendarComponent,
      PatientDocumentsComponent,
      PatientNotesComponent,
      PatientContractsComponent,
      PatientContractsEditComponent,
      VisitDialogComponent,
      CalendarDisplayComponent,
      MasterScheduleModalComponent,
  ],
  entryComponents: [
    MasterScheduleModalComponent,
    VisitDialogComponent,
    PatientContractsEditComponent
  ]
})
export class PatientModule {}
