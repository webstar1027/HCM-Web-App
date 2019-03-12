import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';

import { EmployeeDemographicsModel, Lookup } from '@app/core/models';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { EmployeeService, LookupService } from '@app/core/services';

@Component({
  templateUrl: './employment-info-edit.component.html'
})
export class EmployeeEmploymentInfoEditComponent implements OnInit {
  @ViewChild('employmentInfoEditForm')
  employmentInfoEditForm: NgForm;

  demographicsCopy: EmployeeDemographicsModel;
  onClose: Subject<EmployeeDemographicsModel> = new Subject();

  agencyInsuranceStatusList: Lookup[];
  employmentTypesList: Lookup[];
  employeeTypesList: Lookup[];
  // facilitiesList: Lookup[];
  constructor(
    private lookupService: LookupService,
    private modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.EmployeeTypesLookupService)
      .subscribe(e => {
        this.employeeTypesList = e;
      });
    // this.lookupService.getEnumNameValueLookup(EnumTypesEnum.FacilitiesLookup).subscribe(e => { this.facilitiesList = e; });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.AgencyInsuranceStatus)
      .subscribe(e => {
        this.agencyInsuranceStatusList = e;
      });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.EmploymentTypesLookupService)
      .subscribe(e => {
        this.employmentTypesList = e;
      });
  }

  closeModal(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  saveEmploymentInfo(): void {
    if (this.employmentInfoEditForm.valid) {
      if (!this.employmentInfoEditForm.dirty) {
        this.modalRef.hide();
        return;
      }

      this.employeeService.saveEmploymentInfo(this.demographicsCopy).subscribe(
        () => {
          this.onClose.next(this.demographicsCopy);
          this.modalRef.hide();
        },
        error => {
          console.log('Error saving employee info', error);
          this.toasterService.pop('error', 'Could not update employment info');
        }
      );
    }
  }
}
