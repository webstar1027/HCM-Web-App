
import { Routes } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { AuthGuardService } from "@app/core/guards/route-authentication-guard.service";


export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full", canActivate: [AuthGuardService]
  },
  {
    path: "management",
    loadChildren: "./management/management.module#ManagementModule", canActivate: [AuthGuardService]
  },
  {
    path: "referral",
    loadChildren: "./referral/referral.module#ReferralModule", canActivate: [AuthGuardService]
  },
  {
    path: "patient",
    loadChildren: "./patient/patient.module#PatientModule", canActivate: [AuthGuardService]
  },
  {
    path: "human-resources",
    loadChildren:
      "./human-resources/human-resources.module#HumanResourcesModule", canActivate: [AuthGuardService]
  },
  {
    path: "home",
    loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuardService]
  },

  // Not lazy-loaded routes
  // { path: 'login', component: LoginComponent },

  // Not found
  { path: "**", redirectTo: "home", canActivate: [AuthGuardService]  }
];
