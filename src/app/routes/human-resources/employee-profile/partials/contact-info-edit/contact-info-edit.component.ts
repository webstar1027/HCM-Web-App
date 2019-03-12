import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EmployeeDemographicsModel, IContact } from '@app/core/models';
import { EmployeeService } from '@app/core/services';


@Component({
  templateUrl: './contact-info-edit.component.html'
})
export class EmployeeContactInfoEditComponent implements OnInit {
  @ViewChild('contactInfoEditForm') contactInfoEditForm: NgForm;

  demographicsCopy: EmployeeDemographicsModel;
  onClose: Subject<EmployeeDemographicsModel>;

  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private employeeService: EmployeeService,
    private modalRef: BsModalRef,
    private toasterService: ToasterService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {

  }

  closeModal(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  saveContactInfo(): void {
    if (this.demographicsCopy && this.demographicsCopy.employeeId > 0) {
      if (this.contactInfoEditForm.invalid) {
        return;
      }

      if (!this.contactInfoEditForm.dirty) {
        this.modalRef.hide();
        return;
      }

      this.employeeService.saveContactInfo(this.demographicsCopy).subscribe(r => {
        if (r) {
          this.onClose.next(this.demographicsCopy);
          this.modalRef.hide();
        } else {
          this.toasterService.pop('error', 'Could not update contact info');
        }
      });
    }
  }


  setPrimary(contact: IContact) {
    if (!contact || !contact.contactValue) {
      this.toasterService.pop(
        'error',
        'Set Primary',
        'Primary Contact Method Must Have a Value'
      );
    } else {
      this.demographicsCopy.homePhone.isDefault = false;
      this.demographicsCopy.cellPhone.isDefault = false;
      this.demographicsCopy.emailAddress.isDefault = false;
      this.demographicsCopy.workEmail.isDefault = false;
      contact.isDefault = true;
      this.demographicsCopy.defaultCommunicationType = contact.contactType;
    }
  }


}
