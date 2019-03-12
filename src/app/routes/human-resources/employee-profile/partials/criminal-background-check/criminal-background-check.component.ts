import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs/Subject';
import { EmployeeService, LookupService } from '@app/core/services';
import { Lookup } from '@app/core/models';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
    moduleId: module.id,
    selector: 'app-criminal-background-check',
    templateUrl: 'criminal-background-check.component.html',
    styleUrls: ['criminal-background-check.component.scss']
})
export class EmployeeCriminalBackgroundCheckComponent implements OnInit {
  @ViewChild('criminalBackgroundCheckEditForm')  criminalBackgroundCheckEditForm: NgForm;
  check: any;
  criminalBackgroundCheckResult: Lookup[];
  private onClose: Subject<any>;

  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private employeeService: EmployeeService,
    private lookupService: LookupService
  ) { }

  ngOnInit() {
      this.lookupService
      .getEnumNameValueLookup(LookupTypesEnum.CriminalCheckStatusLookupService)
      .subscribe((res) => {
          this.criminalBackgroundCheckResult = res;
      });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  createBackgroundCheckInfo(): void {
     this.editBackgroundCheckInfo(null);
  }

  editBackgroundCheckInfo(check: any): void {

    this.employeeService.getCurrentEmployeeId().subscribe((id) => {
        this.employeeService.saveCriminalCheckInfo(id, this.check).subscribe((res) => {
            this.modalRef.hide();

            if (this.check.employeeCriminalCheckId > 0) {
              this.toasterService.pop('success', 'Criminal Background Check info updated successfully');
            } else {
              this.toasterService.pop('success', 'Criminal Background Check info created successfully');
            }

            this.employeeService.getCriminalChecks(id).subscribe((checks) => {
                this.onClose.next(checks);
            });
        });
    });
  }
}
