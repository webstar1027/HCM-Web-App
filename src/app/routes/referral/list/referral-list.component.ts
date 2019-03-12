import { Component, OnInit } from "@angular/core";
import {
  ReferralService,
  ExcelExportService,
  CsvExportService,
  PdfExportService,
  LookupService
} from "@app/core/services";
import { PaginationModule, PageChangedEvent } from "ngx-bootstrap/pagination";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { NewReferralWizardComponent } from "../new-referral-wizard/new-referral-wizard.component";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { Lookup } from "@app/core/models";
import { ReferralListSearchModel } from "./referral-list-searchModel";

@Component({
  styleUrls: ["./referral-list.component.scss"],
  templateUrl: "./referral-list.component.html"
})
export class ReferralListComponent implements OnInit {
  isCollapsed = false;
  loadingReferralId: number = null;
  isLoadingReferral = false;
  isLoadingReferralList: boolean;
  referralList: any = [];
  totalItems: number;
  maxSize = 5;
  currentPage = 1;
  newReferralModalRef: BsModalRef;

  exportDataList: object[] = [];
  columns: object[] = [];
  options: any;
  addColumnModal: BsModalRef;
  isLoadingColumnChooser = false;
  coordinatorList: Lookup[];
  searchModel: ReferralListSearchModel;

  dragData = [
    { key: "cdpas", name: "CDPAS" },
    { key: "pdn", name: "PDN" },
    { key: "medicaid_status", name: "Medicaid Status" },
    { key: "medicaid_number", name: "Medicaid Number" },
    { key: "referredOrg", name: "Referred By Organization" },
    { key: "start_date", name: "Approved Start Date" }
  ];

  tableHeadList = [
    { key: "name", name: "Name" },
    { key: "home", name: "Home" },
    { key: "coordinatorId", name: "Intake Coordinator" },
    { key: "status", name: "Status" },
    { key: "coveredForMedicaid", name: "Medicaid" },
    { key: "referredById", name: "Referred By" },
    { key: "statusName", name: "Patient Status" }
  ];

  constructor(
    private referralService: ReferralService,
    private modalService: BsModalService,
    private excelExportService: ExcelExportService,
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService,
    private lookupService: LookupService
  ) {}

  loadReferral(referralId: number): void {
    this.loadingReferralId = referralId;
    this.isLoadingReferral = true;
  }

  refreshReferralList(): void {
    this.isLoadingReferralList = true;
    this.referralService
      .getReferralList(this.currentPage, 25, this.searchModel)
      .subscribe(e => {
        this.referralList = e.data;
        this.totalItems = e.data.length;
        this.currentPage = e.currentPage;
        this.isLoadingReferralList = false;

        this.referralList.forEach(element => {
          const itemData = {
            name: element.fullName,
            home: "Home",
            intake_coordinator: element.coordinator,
            status: "Status",
            medicaid: element.coveredForMedicaid ? "Yes" : "No",
            referredby: element.referredBy ? element.referredBy : "",
            patient_status: element.referralStatus.statusName
          };

          this.exportDataList.push(itemData);
        });
      });
  }

  openNewReferralWizard() {
    this.newReferralModalRef = this.modalService.show(
      NewReferralWizardComponent,
      { class: "modal-lg" }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.refreshReferralList();
  }

  getCoordinatorList(): void {
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.CoordinatorLookupService)
      .subscribe(e => {
        this.coordinatorList = e;
      });
  }
  ngOnInit(): void {
    this.searchModel = new ReferralListSearchModel("", "");
    this.refreshReferralList();
    // this.getCoordinatorList();
    this.columns = [
      { title: "Name", dataKey: "name" },
      { title: "Home", dataKey: "home" },
      { title: "Intake Coordinator", dataKey: "intake_coordinator" },
      { title: "Status", dataKey: "status" },
      { title: "Medicaid", dataKey: "medicaid" },
      { title: "Referred By", dataKey: "referredby" },
      { title: "Patient Status", dataKey: "patient_status" }
    ];

    this.options = {
      headers: [
        "Name",
        "Home",
        "Intake Coordinator",
        "Status",
        "Medicaid",
        "Referred By",
        "Patient Status"
      ]
    };
  }

  exportPDF(): void {
    this.pdfExportService.saveAsPDFFile(
      this.exportDataList,
      "referral",
      this.columns
    );
  }

  exportCSV(): void {
    this.csvExportService.saveAsCsvFile(
      this.exportDataList,
      "referral",
      this.options
    );
  }

  exportXLS(): void {
    this.excelExportService.exportAsExcelFile(this.exportDataList, "referral");
  }

  showColumnChoose(): void {
    this.isLoadingColumnChooser = true;
  }

  onClose(): void {
    this.isLoadingColumnChooser = false;
  }

  transferDataSuccess($event: any): void {
    const data = {
      key: $event.dragData.key,
      name: $event.dragData.name
    };
    this.deleteColumnChooseItem($event.dragData);
    this.tableHeadList.push(data);
    this.addValueExportList($event.dragData);
  }

  private deleteColumnChooseItem(item: any): void {
    const index: number = this.dragData.indexOf(item);

    if (index !== -1) {
      this.dragData.splice(index, 1);
    }
  }

  private addValueExportList(item: any): void {
    const addColumnItem = {
      title: item.name,
      dataKey: item.key
    };

    this.columns.push(addColumnItem);

    this.options.headers.push(item.name);

    this.exportDataList.forEach((element, index) => {
      switch (item.key) {
        case "cdpas":
          element["cdpas"] = this.referralList[index].cdpas;
          break;
        case "pdn":
          element["pdn"] = this.referralList[index].pdn;
          break;
        case "medicaid_status":
          element["medicaid_status"] = this.referralList[
            index
          ].chart.medicaidComments;
          break;
        case "medicaid_number":
          element["medicaid_number"] = this.referralList[
            index
          ].chart.medicaidMemberId;
          break;
        case "referredOrg":
          element["referredOrg"] = "Referred By organization";
          break;
        case "start_date":
          element["start_date"] = this.referralList[index].dateCreated;
          break;
      }
    });
  }
}
