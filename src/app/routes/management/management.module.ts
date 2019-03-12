import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgxSelectModule } from "ngx-select-ex";
import { SharedModule } from "../../shared/shared.module";
import { DndModule } from "ng2-dnd";

// Components
import { WorkflowListComponent } from "./workflow-management/list/workflow-list.component";
import { WorkflowEditComponent } from "./workflow-management/edit/workflow-edit.component";

// Service
import { WorkflowManagementService } from "../../core/services/managment/workflow-management-service";
import { LookupService } from "../../core/services/components/lookup-service";
import { UserManagementListComponent } from "./user-management/list/user-management-list.component";
import { UserProfileEditComponent } from "./user-management/edit-profile/edit-profile.component";

const routes: Routes = [
  { path: "workflowlist", component: WorkflowListComponent },
  { path: "workflow/edit/:templateId", component: WorkflowEditComponent },
  { path: "users", component: UserManagementListComponent },
  { path: "users/profile/:userId", component: UserProfileEditComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxSelectModule,
    SharedModule,
    DndModule.forRoot()
  ],
  providers: [WorkflowManagementService, LookupService],
  declarations: [
    WorkflowListComponent,
    WorkflowEditComponent,
    UserManagementListComponent,
    UserProfileEditComponent
  ]
})
export class ManagementModule { }
