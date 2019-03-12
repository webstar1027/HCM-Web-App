import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs/Subject';
import { EmployeeService, LookupService } from '@app/core/services';
import { Lookup } from '@app/core/models';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
    moduleId: module.id,
    selector: 'app-traning-school',
    templateUrl: 'traning-school.component.html',
    styleUrls: ['traning-school.component.scss']
})
export class TraningSchoolComponent implements OnInit {

  school: any;
  TraningSchoolList: Lookup[];
  private onClose: Subject<any>;

  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private employeeService: EmployeeService,
    private lookupService: LookupService
  ) {}

  ngOnInit() {

    this.lookupService
    .getEnumNameValueLookup(LookupTypesEnum.TrainingSchoolLookupService)
    .subscribe((res) => {
      this.TraningSchoolList = res;
    });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  createTrainingSchoolInfo(): void {
     this.editTrainingSchoolInfo();
  }

  editTrainingSchoolInfo(): void {
    this.employeeService.getCurrentEmployeeId().subscribe((id) => {
       this.employeeService.saveTraningSchoolInfo(id, this.school).subscribe((res) => {
          this.modalRef.hide();

          if (this.school.employeeTrainingId > 0) {
            this.toasterService.pop('success', 'Training School Info is updated successfully');
          } else {
            this.toasterService.pop('success', 'Training School Info is created successfully');
          }

          this.employeeService.getTrainingSchools(id).subscribe((schools) => {
              this.onClose.next(schools);
          });
       });
    });
    console.log('-- this school info --', this.school);
  }
}
