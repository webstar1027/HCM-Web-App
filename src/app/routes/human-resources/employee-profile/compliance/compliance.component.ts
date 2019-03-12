import { OnDestroy, TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from "rxjs/Subject";
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as moment from 'moment';
import 'sweetalert';

import {
  EmployeeAuthorizationInfoEditComponent,
  EmployeeSkillInfoEditComponent,
  EmployeeMedicalInfoEditComponent,
  EmployeeCriminalBackgroundCheckComponent,
  TraningSchoolComponent,
  EmployeeEvaluationInfoEditComponent
} from '../partials';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
   EmployeeComplianceModel,
   EmploymentAuthorizationModel,
   EmployeeMedicalModel,
   CriminalBackgroundCheckModel,
   EmployeeTrainingSchoolModel,
   EvaluationModel,
   Lookup
} from '@app/core/models';

import { EmployeeService, LookupService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';

@Component({
    selector: 'app-compliance',
    templateUrl: './compliance.component.html',
    styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit, OnDestroy {
  compliance: EmployeeComplianceModel;
  medicalInfo: EmployeeMedicalModel;
  authorization: any;
  skills: any[];

  employeeMedicals: any[];
  employeeMedicalsCopy1: any[];
  employeeMedicalsCopy2: any[];

  employeeCriminalChecks: any[];
  employeeCriminalChecksCopy1: any[];
  employeeCriminalChecksCopy2: any[];

  trainingSchools: any[];

  employeeEvaluations: any[];
  employeeEvaluationsCopy1: any[];
  employeeEvaluationsCopy2: any[];

  schoolInfo: EmployeeTrainingSchoolModel;
  evaluationInfo: EvaluationModel;
  i9Doc1NameList: Lookup[];
  i9Doc2NameList: Lookup[];
  viewMedical: any;
  viewCriminal: any;
  viewEval: any;

  returnArray: object[];
  nameArray: object[];

  evalNameArray: object[];
  returnEvalArray: object[];

  private subscription: Subscription;
  private authorizationModalRef: BsModalRef;
  private skillModalRef: BsModalRef;
  private medicalModalRef: BsModalRef;
  private criminalBackgroundCheckModalRef: BsModalRef;
  private traningSchoolModalRef: BsModalRef;
  private evaluationModalRef: BsModalRef;

  constructor(
      private employeeService: EmployeeService,
      private modalService: BsModalService,
      private lookupService: LookupService,
      private toastService: ToasterService
  ) { }

  ngOnInit(): void {
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

    this.subscription = this.employeeService.getCurrentEmployeeId().subscribe(id => {
      this.employeeService.getEmployeeCompliance(id).subscribe(data => {
        this.compliance = data;

        this.authorization = {
            i9Document1TypeId: data.i9Doc1TypeId,
            i9Document1Expiration: data.i9Doc1ExpirationDate,
            i9Document1ReceiptReceived: data.i9Doc1PendingReceiptReceived,
            i9Document2TypeId: data.i9Doc2TypeId,
            i9Document2Expiration: data.i9Doc2ExpirationDate,
            i9Document2ReceiptReceived: data.i9Doc2PendingReceiptReceived,
            verified: data.i9DocumentsVerified,
            reference: data.reference1,
            additionalReference: data.reference2,
            lastEmploymentAgency: data.lastEmploymentAgency,
            lastEmploymentFrom: data.lastEmploymentFromDate,
            lastEmploymentTo: data.lastEmploymentToDate,
            exclusionListCheckedOn: data.exclusionListCheckedDate
        };

        if (data.i9Doc1TypeId != null) {
            this.authorization.i9Document1Name = this.i9Doc1NameList[data.i9Doc1TypeId - 1].name;
        } else {
            this.authorization.i9Document1Name = '';
        }

        if (data.i9Doc1TypeId != null) {
            this.authorization.i9Document2Name = this.i9Doc2NameList[data.i9Doc2TypeId - 1].name;
        } else {
            this.authorization.i9Document2Name = '';
        }
      });

      // Get general compliance object.
      this.employeeService.getGeneralCompliance(id).subscribe((skills) => {
          this.skills = skills;
      });

      this.getEmployeeMedicals(id);

      this.employeeService.getCriminalChecks(id).subscribe((checks) => {
          this.employeeCriminalChecksCopy1 = checks;
          this.employeeCriminalChecksCopy2 = this.getLatestCriminalChecks(checks);
          this.employeeCriminalChecks = this.employeeCriminalChecksCopy2;
      });

      this.employeeService.getTrainingSchools(id).subscribe((schools) => {
          this.trainingSchools = schools;
      });

      this.employeeService.getEvaluations(id).subscribe((evals) => {
          this.getEvalNameArray(evals);
          this.employeeEvaluationsCopy1 = evals;
          this.employeeEvaluationsCopy2 = this.getLatestEvaluations(evals);
          this.employeeEvaluations = this.employeeEvaluationsCopy2;
          console.log(evals);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getEmployeeMedicals(id: number): void {
    this.employeeService.getEmployeeMedical(id).subscribe((medicals) => {

      this.getNameArray(medicals);

      this.employeeService.getCurrentEmployee(id).subscribe((res) => {
        this.employeeService.getComplianceMedicals(res.organizationId).subscribe((result) => {

          medicals.forEach((medical) => {
            result.forEach((item, index) => {
               if (medical.medicalName === item.medicalName) {
                  medical.medicalResultSetId = item.medicalResultSetId;
               }
            });
          });

          this.employeeMedicalsCopy1 = medicals;
          this.employeeMedicalsCopy2 = this.findLatestItemArray(medicals);
          this.employeeMedicals = this.employeeMedicalsCopy2;

        });
      });
    });
  }
  editAuthorizationInfo(): void {
    const initialState = {
      authorization: this.authorization
    };

    this.authorizationModalRef = this.modalService.show(
      EmployeeAuthorizationInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  editSkillInfo(): void {
    const initialState = {
      skills: this.skills,
      onClose: new Subject<any>()
    };

    initialState.onClose.subscribe((res) => {
        this.skills = res;
    });

    this.skillModalRef = this.modalService.show(
      EmployeeSkillInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  showModal(template: TemplateRef<any>): void {
    const initialState = {
      compliance: this.compliance.medicals
    };

    this.medicalModalRef = this.modalService.show(
      EmployeeMedicalInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  openMedicalEditModal(medical: EmployeeMedicalModel): void {
    const initialState = {
      medical: medical,
      onClose: new Subject<any>()
    };

    initialState.onClose.subscribe((res) => {
      this.viewMedical = false;
      this.ngOnInit();
      this.employeeService.getCurrentEmployeeId().subscribe(id => {
        this.getEmployeeMedicals(id);
      });
    });

    this.medicalModalRef = this.modalService.show(
      EmployeeMedicalInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  deleteMedical(medical: EmployeeMedicalModel): void {
    sweetAlert({
      title:   'Are you sure?',
      text:    'Once deleted, you will not be able to recover this medical info!',
      icon:    'warning',
      buttons: [true, true],
      dangerMode: true
    }).then(willDelete => {
      this.viewMedical = false;
      this.ngOnInit();

      this.employeeService.getCurrentEmployeeId().subscribe((id) => {
        this.employeeService.deleteEmployeeMedical(id, medical.employeeMedicalId).subscribe((res) => {
            this.getEmployeeMedicals(id);
        });
      });
    }).catch(() => {});
  }

  openBackgroundEditModal(background: CriminalBackgroundCheckModel): void {
    const initialState = {
      check: background,
      onClose: new Subject<any>()
    };

    initialState.onClose.subscribe((_res) => {
      this.viewCriminal = false;
      this.ngOnInit();
      this.employeeCriminalChecks = _res;
    });

    this.criminalBackgroundCheckModalRef = this.modalService.show(
      EmployeeCriminalBackgroundCheckComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
      }
    );
  }

  deleteCheck(check: any ): void {
    sweetAlert({
      title:    'Are you sure?',
      text:    'Once deleted, you will not be able to recover this criminal background check info!',
      icon:    'warning',
      buttons: [true, true],
      dangerMode: true
    }).then(willDelete => {
      this.viewCriminal = false;
      this.ngOnInit();

      this.employeeService.getCurrentEmployeeId().subscribe(id => {
          this.employeeService.deleteCriminalCheck(id, check.employeeCriminalCheckId).subscribe((res) => {
              this.toastService.pop('success', 'Selected Info is deleted Successfully');
              this.employeeService.getCriminalChecks(id).subscribe((checks) => {
                  this.employeeCriminalChecks = checks;
              });
          });
      });
    }).catch((error) => {
        this.toastService.pop('error', error);
    });
  }

  openTraningSchoolEditModal(school: EmployeeTrainingSchoolModel): void {
    const initialState = {
       school: school,
       onClose: new Subject<any>()
    };

    initialState.onClose.subscribe((res) => {
       this.trainingSchools = res;
    });

    this.traningSchoolModalRef = this.modalService.show(
      TraningSchoolComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  deleteSchool(school: any): void {
    sweetAlert({
      title:    'Are you sure?',
      text:    'Once deleted, you will not be able to recover this traning school info!',
      icon:    'warning',
      buttons: [true, true],
      dangerMode: true
    }).then(willDelete => {
      this.employeeService.getCurrentEmployeeId().subscribe(id => {
          this.employeeService.deleteTrainingSchool(id, school.employeeTrainingId).subscribe((res) => {
              this.toastService.pop('success', 'Selected Info is deleted Successfully');
              this.employeeService.getTrainingSchools(id).subscribe((schools) => {
                  this.trainingSchools = schools;
              });
          });
      });
    }).catch(() => {});
  }

  openEvaluationEditModal(evaluation: EvaluationModel): void {
    const initialState = {
      evaluation: evaluation,
      onClose: new Subject<any>()
    };

    initialState.onClose.subscribe((res) => {
        this.viewEval = false;
        this.ngOnInit();
        this.employeeEvaluations = res;
    });


    this.evaluationModalRef = this.modalService.show(
      EmployeeEvaluationInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );
  }

  deleteEvaluation(evaluation: any): void {
    sweetAlert({
      title:    'Are you sure?',
      text:    'Once deleted, you will not be able to recover this evaluation other info!',
      icon:    'warning',
      buttons: [true, true],
      dangerMode: true
    }).then(willDelete => {
      this.viewEval = false;
      this.ngOnInit();

      this.employeeService.getCurrentEmployeeId().subscribe(id => {
          this.employeeService.deleteEvaluation(id, evaluation.employeeEvaluationId).subscribe((res) => {
              this.toastService.pop('success', 'Selected Info is deleted Successfully');
              this.employeeService.getEvaluations(id).subscribe((evals) => {
                  this.employeeEvaluations = evals;
              });
          });
      });

    }).catch(() => {});
  }

  getClassName(expirationDate: Date): string {
    if (!expirationDate) {
      return '';
    }

    const today = moment(new Date());
    const expiration = moment(expirationDate);
    const daysDiff = moment.duration(expiration.diff(today)).asDays();

    if (daysDiff <= 0) {
      return 'red';
    } else if (daysDiff < 40) {
      return 'yellow';
    }
    return '';
  }

  toggleMedicals(): void {
    if (this.viewMedical === false ) {
      this.employeeMedicals = this.employeeMedicalsCopy2;
    } else {
      this.employeeMedicals = this.employeeMedicalsCopy1;
    }
  }

  private findLatestItemArray(array: any[]): any[] {
    let lastDate = "01/01/1998 00:00:00";
    let i = 0;
    this.returnArray = [];

    this.nameArray.forEach((item) => {
      array.forEach((arrayItem, index) => {
        if (item === arrayItem.medicalName) {
          if (new Date(lastDate) < new Date(arrayItem.dateReceived)) {
            lastDate = arrayItem.dateReceived;
            i = index;
          }
        }
      });

      this.returnArray.push(array[i]);
      lastDate = "01/01/1998 00:00:00";
      i = 0;
    });

    return this.returnArray;
  }

  private getNameArray(array: any[]): void {

    let flag = false;
    this.nameArray = [];

    array.forEach((item) => {
      if (this.nameArray.length === 0) {
        this.nameArray.push(item.medicalName);
      } else {

        this.nameArray.forEach((item1) => {
          if (item1 === item.medicalName) {
            flag = true;
          }
        });

        if (flag === false) {
          this.nameArray.push(item.medicalName);
        }

        flag = false;
      }
    });
  }

  private getEvalNameArray(array: any[]): void {

    let flag = false;
    this.evalNameArray = [];

    array.forEach((item) => {
      if (this.evalNameArray.length === 0) {
        this.evalNameArray.push(item.evaluationName);
      } else {
        this.evalNameArray.forEach((item1) => {
          if (item1 === item.evaluationName) {
            flag = true;
          }
        });

        if (flag === false) {
          this.evalNameArray.push(item.evaluationName);
        }

        flag = false;
      }
    });
  }

  toggleCriminals(): void {
    if (this.viewCriminal === false ) {
      this.employeeCriminalChecks = this.employeeCriminalChecksCopy2;
    } else {
      this.employeeCriminalChecks = this.employeeCriminalChecksCopy1;
    }
  }

  private getLatestCriminalChecks(array: any[]): any[] {
    let lastDate = "01/01/1998 00:00:00";
    let i = 0;
    this.returnArray = [];
    array.forEach((arrayItem, index) => {
        if (new Date(lastDate) < new Date(arrayItem.sentOutDate)) {
          lastDate = arrayItem.sentOutDate;
          i = index;
        }
    });
    this.returnArray.push(array[i]);
    return this.returnArray;
  }

  private getLatestEvaluations(array: any[]): any[] {
      let lastDate = "01/01/1998 00:00:00";
      let i = 0;
      this.returnEvalArray = [];

      this.evalNameArray.forEach((item) => {
        array.forEach((arrayItem, index) => {
          if (item === arrayItem.evaluationName) {
            if (new Date(lastDate) < new Date(arrayItem.completionDate)) {
              lastDate = arrayItem.completionDate;
              i = index;
            }
          }
        });

        this.returnEvalArray.push(array[i]);
        lastDate = "01/01/1998 00:00:00";
        i = 0;
      });
      return this.returnEvalArray;
  }

  toggleEvaluation(): void {
    if (this.viewEval === false ) {
      this.employeeEvaluations = this.employeeEvaluationsCopy2;
    } else {
      this.employeeEvaluations = this.employeeEvaluationsCopy1;
    }
  }
}
