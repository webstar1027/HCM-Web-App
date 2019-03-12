import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FileUploadModule } from "ng2-file-upload";

import { SharedModule } from "../../shared/shared.module";
import { DocumentsListComponent } from "./list/documents-list.component";
import { LookupService } from "../../core/services/components/lookup-service";
import { PatientService } from '../../core/services/patient/patient.service';
import { EmployeeService } from '../../core/services/human-resources/employee.service';

const routes: Routes = [
  { path: "", pathMatch: "full", component: DocumentsListComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FileUploadModule
  ],
  providers: [LookupService, PatientService, EmployeeService],
  declarations: [DocumentsListComponent]
})
export class DocumentsModule {}
