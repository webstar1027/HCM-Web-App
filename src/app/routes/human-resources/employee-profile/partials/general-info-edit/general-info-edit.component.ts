import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

import { EmployeeDemographicsModel, Lookup } from '@app/core/models';
import { EmployeeService, LookupService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
  templateUrl: './general-info-edit.component.html'
})
export class EmployeeGeneralInfoEditComponent implements OnInit {
  @ViewChild('generalInfoEditForm')
  generalInfoEditForm: NgForm;

  demographicsCopy: EmployeeDemographicsModel;
  onClose: Subject<EmployeeDemographicsModel>;

  countriesList: Lookup[];
  ethnicitiesList: Lookup[];
  languagesList: Lookup[];
  maritalStatusList: Lookup[];

  constructor(
    private employeeService: EmployeeService,
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.CountriesLookupService)
      .subscribe(e => {
        this.countriesList = e;
      });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.EthnicitiesLookupService)
      .subscribe(e => {
        this.ethnicitiesList = e;
      });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.LanguageLookupService)
      .subscribe(e => {
        this.languagesList = e;
      });
    this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.MaritalStatus)
      .subscribe(e => {
        this.maritalStatusList = e;
      });
  }

  closeModal(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  saveGeneralInfo(): void {
    if (this.demographicsCopy && this.demographicsCopy.employeeId > 0) {
      if (this.generalInfoEditForm.invalid) {
        this.toasterService.pop('error', 'Please correct the form before saving');
        return;
      }

      if (!this.generalInfoEditForm.dirty) {
        this.modalRef.hide();
        return;
      }

      this.employeeService.saveGeneralInfo(this.demographicsCopy).subscribe(
        () => {
          this.onClose.next(this.demographicsCopy);
          this.modalRef.hide();
        },
        error => {
          this.toasterService.pop('error', 'Could not update General employee info');
          console.log('Error saving employee info', error);
          this.modalRef.hide();
        }
      );
    }
  }
}
