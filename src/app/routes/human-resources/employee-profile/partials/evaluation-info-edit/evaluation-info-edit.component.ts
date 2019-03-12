import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs/Subject';
import { EmployeeService } from '@app/core/services';
import { LookupService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { Lookup } from '@app/core/models';

@Component({
    moduleId: module.id,
    selector: 'app-evaluation-info-edit',
    templateUrl: 'evaluation-info-edit.component.html',
    styleUrls: ['evaluation-info-edit.component.scss']
})
export class EmployeeEvaluationInfoEditComponent implements OnInit {
  statusList: Lookup[];
  evaluationsList: Lookup[];
  evaluation: any;
  private onClose: Subject<any>;
  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private lookupService: LookupService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.lookupService
    .getEnumNameValueLookup(LookupTypesEnum.EvaluationLookupService)
    .subscribe((res) => {
        this.evaluationsList = res;
    });

    this.lookupService
    .getEnumNameValueLookup(LookupTypesEnum.EmployeeEvaluationStatus)
    .subscribe((res) => {
        this.statusList = res;
    });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  createEvaluationInfo(): void {
      this.editEvaluationInfo();
  }

  editEvaluationInfo(): void {
      this.employeeService.getCurrentEmployeeId().subscribe((id) => {
          this.employeeService.saveEvaluationInfo(id, this.evaluation).subscribe((res) => {
              this.modalRef.hide();

              if (this.evaluation.employeeEvaluationId > 0 ) {
                this.toasterService.pop('success', 'Evaluation other info is updated successfully');
              } else {
                this.toasterService.pop('success', 'Evaluation other info is created successfully');
              }

              this.employeeService.getEvaluations(id).subscribe((evals) => {
                 this.onClose.next(evals);
              });
          });
      });
  }

}
