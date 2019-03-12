import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { LookupService } from "../../../core/services/components/lookup-service";
import { Lookup } from "../../../core/models/lookup";
import { FileUploader } from "ng2-file-upload";
import { DocumentModel } from '../../../core/models';
import { PatientService } from '../../../core/services/patient/patient.service';
import { EmployeeService } from '../../../core/services';
import { ToasterService } from 'angular2-toaster';
import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "@app/core/authorization/auth.service";

const URL = "https://api.myhcit.com/api/documents/saveDocument";
// const URL = "https://evening-anchorage-3159.herokuapp.com/api/";


@Component({
  selector: "app-documents-component",
  templateUrl: "./documents-list.component.html",
  styleUrls: ['./documents-list.component.scss']
})
export class DocumentsListComponent implements OnInit {
  documentTypeDetailList: Lookup[];
  documentTypes: Lookup[];
  documentPath: string;
  selectedDocumentType: number;
  linkType: string;
  modalRef: BsModalRef;
  patientList: object[];
  contractList: object[];
  employeeList: object[];
  documentDetail: object[];
  documentLink: object[] = [];
  accessToken: any;

  employeeName: string;
  document: DocumentModel = new DocumentModel();
  selectedItem: any;
  itemClick = false;

  docListDataSource = new MatTableDataSource<any>(null);

  totalInSearchResult = 100;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions: number[] = [10, 15, 25, 75];

  columnsToDisplay = [
    "typeColumn",
    "docNameColumn",
    "insuNameColumn",
    "startDateColumn",
    "endDateColumn",
    "dateCreatedColumn",
    "editColumn"
  ];

  documentList = [
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      },
      {
        typeColumn: 'test1',
        docNameColumn: 'test2',
        insuNameColumn: 'test3',
        startDateColumn: '12/08/2018',
        endDateColumn: '12/08/2018',
        dateCreatedColumn: '12/08/2018'
      }
  ];


  public hasBaseDropZoneOver = false;
  public uploader: FileUploader;

  constructor(
    private lookupService: LookupService,
    private modalService: BsModalService,
    public patientService: PatientService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toasterService: ToasterService,
    private authService: AuthService
  ) {}

  onDocumentTypeChange(documentType: number): void {
    this.selectedDocumentType = documentType;
  }

  openModal(template: TemplateRef<any>) {
    this.uploader = new FileUploader({ url: URL, isHTML5: true, authToken: `Bearer ${this.accessToken}`});
    this.modalRef = this.modalService.show(template, {
      class: "modal-lg",
      ignoreBackdropClick: true
    });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public onFileDrop(e: any): void {
    this.uploader.uploadAll();
  }

  ngOnInit(): void {
    // get document type list
    this.accessToken = this.authService.getAccessToken();
    console.log('access token -- Bearer ', this.accessToken);
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.DocumentTypesLookupService).subscribe((e) => {
      this.documentTypes = e;
    });

    // get Patient list
    this.patientService.getPatientList(1, 10000).subscribe((e) => {
        this.patientList = e.data;
    });

    // get documentypedetail list
    this.route.data.subscribe((res) => {
        switch (res.linkType) {
            case 'Patient':
              this.linkType = '1';
              this.documentPath = 'Chart';
              break;
            case 'Referral':
              this.linkType = '1';
              this.documentPath = 'Chart';
              break;
            case 'Employee':
              this.linkType = '2';
              this.documentPath = 'Employee';
              break;
        }

        this.lookupService.getEnumNameValueLookup(LookupTypesEnum.DocumentTypeDetailsLookupService, this.linkType, "%20").subscribe((e) => {
          this.documentTypeDetailList = e;
          console.log(this.documentTypeDetailList);
        });
    });

    // get employeelist
    this.employeeService.getEmployeeList().subscribe((e) => {
        this.employeeList = e;
    });
  }

  saveDocument(): void {
    if (this.documentTypeDetailList[this.document.documentTypeDetailId].additionalData.isContractSpecific === true) {
        const documentLinkModel = {
          linkId: parseInt(this.linkType),
          linkType: this.documentPath
        };
        this.documentLink.push(documentLinkModel);
    }

    if (this.documentTypeDetailList[this.document.documentTypeDetailId].additionalData.isContractSpecific === true) {
        this.documentDetail = [];
    }

    const model = {
        documentId: 0,
        documentTypeDetailId: this.documentTypeDetailList[this.document.documentTypeDetailId].additionalData.documentTypeDetailId,
        documentName: this.document.documentName,
        documentTypeName: this.documentTypeDetailList[this.document.documentTypeDetailId].additionalData.documentTypeName,
        startDate: this.document.startDate,
        endDate: this.document.endDate,
        documentFileName: this.uploader.queue[0].file.name,
        documentPath: this.documentPath,
        documentDetails:  null,
        documentLinks: this.documentLink,
        file: this.uploader.queue[0].file
    };

    console.log("document model", model);
    this.patientService.saveDocument(model).subscribe((res) => {
          this.toasterService.pop('success', 'document is created successfully');
          this.modalRef.hide();
      },
      error => {
        this.toasterService.pop('error', 'Could not create document');
        console.log('Error saving employee info', error);
        this.modalRef.hide();
      }
    );
  }

  changeDocType(item: any): void {
    console.log(item.name);
    this.selectedItem = item;
    this.itemClick = true;
  }

  onPaginateChange(event: PageEvent) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }

  onChangeChart(value: string): void {
      // tslint:disable-next-line:radix
      const chartId = parseInt(value);
      console.log(chartId);
      this.patientService.getChartContracts(chartId).subscribe((e) => {
          this.contractList = e;
      });
  }
}
