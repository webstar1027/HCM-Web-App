
import { AddressManagementService } from './components/address-management.service';
import { EmployeeService } from './human-resources/employee.service';
import { LookupService } from './components/lookup-service';
import { NoteService } from './components/notes-service';
import { ReferralService } from './referral/referral.service';
import { WorkflowManagementService } from './managment/workflow-management-service';
import { PatientService } from './patient/patient.service';
import { ExcelExportService } from './components/excel-export.service';
import { CsvExportService } from './components/csv-export.service';
import { PdfExportService } from './components/pdf-export.service';
import { CalendarService } from './calendar/calendar.service';
import { SidenavService } from './components/sidenav.service';

export const SERVICES = [
  AddressManagementService,
  EmployeeService,
  LookupService,
  NoteService,
  ReferralService,
  WorkflowManagementService,
  PatientService,
  ExcelExportService,
  CsvExportService,
  PdfExportService,
  CalendarService,
  SidenavService
];
export {
  AddressManagementService,
  EmployeeService,
  LookupService,
  NoteService,
  ReferralService,
  WorkflowManagementService as WorkflowManagentService,
  PatientService,
  ExcelExportService,
  CsvExportService,
  PdfExportService,
  CalendarService,
  SidenavService
};
