import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

import { routes } from "./routes";
import { MedicaidEditComponent } from "./referral/partials/medicaid-edit/medicaide-edit.component";
import { EmergencyContactComponent } from "./referral/partials/emergency-contact/emergency-contact.component";
import { CoordinationEditComponent } from "./referral/partials/coordination-edit/coordination-edit.component";
import { ClinicalInofEditComponent } from "./referral/partials/clinical-edit/clinical-info-edit.component";
import { ClinicalPhysicianEditComponent } from "./referral/partials/clinical-physician-edit/clinical-physician-edit.component";
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../shared/components/demo-utils/module';
import { AuthorizationEditComponent } from "./patient/profile/contracts/authorization-edit/authorization-edit.component";


@NgModule({
  imports: [
    SharedModule,
    CalendarModule,
    RouterModule.forRoot(routes, { enableTracing: false, useHash: true })
  ],
  declarations: [
    AuthorizationEditComponent,
    EmergencyContactComponent,
    MedicaidEditComponent,
    CoordinationEditComponent,
    ClinicalInofEditComponent,
    ClinicalPhysicianEditComponent
  ],
  entryComponents: [
     EmergencyContactComponent,
     AuthorizationEditComponent,
     MedicaidEditComponent,
     CoordinationEditComponent,
     ClinicalInofEditComponent,
     ClinicalPhysicianEditComponent,
  ],
  exports: [RouterModule]
})
export class RoutesModule {
  constructor() {}
}
