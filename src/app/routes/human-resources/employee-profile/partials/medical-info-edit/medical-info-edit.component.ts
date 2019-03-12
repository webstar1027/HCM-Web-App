import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { EmployeeMedicalModel, Lookup, OrganizationMedicalModel } from '@app/core/models';
import { Observable } from 'rxjs/Observable';
import { EnumTypesEnum } from '../../../../../core/enum-types-enum';

import { EmployeeService, LookupService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
    moduleId: module.id,
    selector: 'app-medical-info-edit',
    templateUrl: 'medical-info-edit.component.html',
    styleUrls: ['medical-info-edit.component.scss']
})
export class EmployeeMedicalInfoEditComponent implements OnInit {
  medical: any;
  organizationId: number;
  employeeId: number;
  complianceMedicals: any[];
  MedicalResult: Lookup[];
  onClose: Subject<EmployeeMedicalModel>;

  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private employeeService: EmployeeService,
    private lookupService: LookupService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
      // Get organizationId from employee object directly
    this.employeeService.getCurrentEmployeeId().subscribe((id) => {
        this.employeeService.getCurrentEmployee(id).subscribe((res) => {
            this.organizationId = res.organizationId;
            // Get compliance
            this.employeeService.getComplianceMedicals(this.organizationId).subscribe((result) => {
                this.complianceMedicals = result;
            });
        });
    });
  }

  onChange(newValue: any): void {
    this.complianceMedicals.forEach((item, index) => {
        if (newValue === item.orgMedicalId) {
            this.lookupService
            .getEnumNameValueLookup(LookupTypesEnum.MedicalResultLookupService, item.medicalResultSetId).subscribe((res) => {
                this.MedicalResult = res;
            });
        }
    });
  }

  isEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  closeModal(): void {
    this.onClose.next(null);
    this.modalRef.hide();
  }

  createMedicalInfo(): void {
     this.editMedicalInfo(null);
  }

  editMedicalInfo(medical: any ): void {

    console.log(this.medical);
    this.employeeService.getCurrentEmployeeId().subscribe(id => {
        this.employeeService.saveEmployeeMedical(id, this.medical).subscribe((res) => {
            console.log(res);
            this.onClose.next(this.medical);
            this.modalRef.hide();
            if (this.medical.employeeMedicalId > 0) {
              this.toasterService.pop('success', 'Medical Info is updated successfully');
            } else {
              this.toasterService.pop('success', 'Medical Info is created successfully');
            }
        },
        error => {
          this.toasterService.pop('error', 'Could not update Medical Info.');
          this.modalRef.hide();
        });
    });
  }
}
