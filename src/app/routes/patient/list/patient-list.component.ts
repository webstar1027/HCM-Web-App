import { Component, OnInit } from "@angular/core";
import { PatientService, ReferralService } from "@app/core/services";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-patient-list",
  templateUrl: "./patient-list.component.html",
  styleUrls: ["./patient-list.component.css"]
})
export class PatientListComponent implements OnInit {
  isCollapsed = false;
  loadingPatientId: number = null;
  isLoadingPatient = false;
  isLoadingPatientList: boolean;

  // Paging details
  totalInSearchResult = 100;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions: number[] = [10, 15, 25, 75];

  patientList: any[];
  patient: any;

  bogusDataSource = new MatTableDataSource<any>(null);

  columnsToDisplay = [
    "nameColumn",
    "residentTypeColumn",
    "countyColumn",
    "editColumn"
  ];
  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.refreshPatientList();
  }

  loadPatient(patientId: number): void {
    this.loadingPatientId = patientId;
    this.isLoadingPatient = true;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }

  refreshPatientList(): void {
    this.isLoadingPatientList = true;
    this.patientService
      .getPatientList(this.pageIndex, this.pageSize)
      .subscribe(e => {
        this.patientList = e.data;
        this.totalInSearchResult = e.totalInSearchResult;

        this.isLoadingPatientList = false;
        console.log(e);
      });
  }

  onPaginateChange(event: PageEvent) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshPatientList();
  }
}
