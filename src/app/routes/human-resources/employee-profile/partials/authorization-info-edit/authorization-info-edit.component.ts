import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import e from 'sweetalert';

import { EmployeeService, LookupService } from '@app/core/services';
import { EmploymentAuthorizationModel, Lookup } from '@app/core/models';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
    moduleId: module.id,
    selector: 'app-authorization-info-edit',
    templateUrl: './authorization-info-edit.component.html',
    styleUrls: ['./authorization-info-edit.component.scss']
})

export class EmployeeAuthorizationInfoEditComponent implements OnInit {
    @ViewChild('authorizationInfoEditForm')
    authorizationInfoEditForm: NgForm;

    i9Doc1NameList: Lookup[];
    i9Doc2NameList: Lookup[];
    authorizationCopy: any;

    onClose: Subject<EmploymentAuthorizationModel>;
    authorization: EmploymentAuthorizationModel;

    constructor(
      private modalRef: BsModalRef,
      private toasterService: ToasterService,
      private employeeService: EmployeeService,
      private lookupService: LookupService
    ) {
      this.onClose = new Subject();
    }

    ngOnInit() {
      this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.I9PrimaryDocumentTypesLookupService)
      .subscribe(list1 => {
        this.i9Doc1NameList = list1;
      });

      this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.I9SecondaryDocumentTypesLookupService)
      .subscribe( list2 => {
        this.i9Doc2NameList = list2;
      });

      this.authorizationCopy = this.authorization;
    }

    closeModal(): void {
       this.onClose.next(null);
       this.modalRef.hide();
    }

    saveAuthorizationInfo(): void {

      this.employeeService.getCurrentEmployeeId().subscribe(id => {
        this.employeeService.saveAuthorizationInfo(id, this.authorizationCopy).subscribe((res) => {
          this.authorizationCopy.i9Document1Name = this.i9Doc1NameList[this.authorizationCopy.i9Document1TypeId].name;
          this.authorizationCopy.i9Document2Name = this.i9Doc2NameList[this.authorizationCopy.i9Document2TypeId].name;
          this.onClose.next(this.authorizationCopy);
          this.modalRef.hide();
        },
        error => {
          this.toasterService.pop('error', 'Could not update Authorization info');
          console.log('Error saving authorization info', error);
          this.modalRef.hide();
        });
      });
    }
}
