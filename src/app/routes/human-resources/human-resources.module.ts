import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { EmployeeDemographicsResolver } from '@app/core/resolvers/employee/employee-demographics.resolver';

import {
  EmployeeService,
  LookupService,
  PdfExportService,
  CsvExportService,
  ExcelExportService
} from '@app/core/services';

import { EmployeesComponent } from './employees/employees.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { DemographicsComponent } from './employee-profile/demographics/demographics.component';
import { ComplianceComponent } from './employee-profile/compliance/compliance.component';

import {
    EmployeeContactInfoEditComponent,
    EmployeeEmploymentInfoEditComponent,
    EmployeeGeneralInfoEditComponent,
    EmployeeAuthorizationInfoEditComponent,
    EmployeeSkillInfoEditComponent,
    EmployeeMedicalInfoEditComponent,
    EmployeeCriminalBackgroundCheckComponent,
    TraningSchoolComponent,
    EmployeeEvaluationInfoEditComponent
} from './employee-profile/partials';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  { path: 'employees', component: EmployeesComponent },
  {
    path: 'profile/:id', component: EmployeeProfileComponent, resolve: { employee: EmployeeDemographicsResolver }, children: [
      { path: '', pathMatch: 'full', redirectTo: 'demographics' },
      { path: 'demographics', component: DemographicsComponent },
      { path: 'compliance', component: ComplianceComponent },
      { path: 'documents', loadChildren: "../documents/documents.module#DocumentsModule", data: { linkType: "Employee" }}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    EmployeesComponent,
    EmployeeProfileComponent,
    DemographicsComponent,
    ComplianceComponent,
    EmployeeGeneralInfoEditComponent,
    EmployeeContactInfoEditComponent,
    EmployeeEmploymentInfoEditComponent,
    EmployeeAuthorizationInfoEditComponent,
    EmployeeSkillInfoEditComponent,
    EmployeeMedicalInfoEditComponent,
    EmployeeCriminalBackgroundCheckComponent,
    TraningSchoolComponent,
    EmployeeEvaluationInfoEditComponent
  ],
  entryComponents: [
    EmployeeGeneralInfoEditComponent,
    EmployeeContactInfoEditComponent,
    EmployeeEmploymentInfoEditComponent,
    EmployeeAuthorizationInfoEditComponent,
    EmployeeSkillInfoEditComponent,
    EmployeeMedicalInfoEditComponent,
    EmployeeCriminalBackgroundCheckComponent,
    TraningSchoolComponent,
    EmployeeEvaluationInfoEditComponent
  ],
  providers: [
    EmployeeService,
    EmployeeDemographicsResolver,
    LookupService,
    ExcelExportService,
    CsvExportService,
    PdfExportService
  ]
})
export class HumanResourcesModule { }
