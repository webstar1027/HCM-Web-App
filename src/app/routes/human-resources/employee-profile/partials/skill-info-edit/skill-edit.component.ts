import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { SkillObject } from '@app/core/models/interfaces';

import { EmployeeService } from '@app/core/services';
import { EmploymentAuthorizationModel, Lookup } from '@app/core/models';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'app-skill-edit',
    templateUrl: './skill-edit.component.html',
    styleUrls: ['./skill-edit.component.scss']
})
export class EmployeeSkillInfoEditComponent implements OnInit {
  @ViewChild('skillinfoEditForm') skillinfoEditForm: NgForm;

  skills: any[];
  skill: SkillObject = {};
  employeeId: number;
  flag: boolean;
  private onClose: Subject<any[]>;

  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private employeeService: EmployeeService
  ) { this.onClose = new Subject(); }

  ngOnInit() {

    this.skills.forEach((item) => {
        switch (item.generalComplianceItem) {
          case 1:
            this.skill.cpr = item.value;
            this.skill.cprExpiration = item.expirationDate;
            this.skill.cprVerification = item.verificationDate;
            break;

          case 2:
            this.skill.professionalLicenseNumber = item.value;
            this.skill.professionalLicenseExpiration = item.expirationDate;
            this.skill.professionalLicenseVerification = item.verificationDate;
            break;

          case 3:
            this.skill.driversLicenseId = item.value;
            this.skill.driversLicenseExpiration = item.expirationDate;
            this.skill.driversLicenseVerification = item.verificationDate;
            break;

          case 4:
            this.skill.automobileInsurance = item.value;
            this.skill.automobileInsuranceExpiration = item.expirationDate;
            this.skill.automobileInsuranceVerification = item.verificationDate;
            break;

          case 5:
            this.skill.malpracticeInsurance = item.value;
            this.skill.malpracticeInsuranceExpiration = item.expirationDate;
            this.skill.malpracticeInsuranceVerification = item.verificationDate;
            break;

          case 6:
            this.skill.npi = item.value;
            this.skill.npiExpiration = item.expirationDate;
            this.skill.npiVerification = item.verificationDate;
            break;
        }
    });

    this.employeeService.getCurrentEmployeeId().subscribe((id) => {
        this.employeeId = id;
    });
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  saveSkillInfo(): void {

      if (this.skillinfoEditForm.invalid) {
        this.toasterService.pop('error', 'Please correct the form before saving');
        return;
      }
      const EditSkills = [];
      const item1 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("CPR"),
          generalComplianceItem: "CPR",
          employeeId: this.employeeId,
          expirationDate: this.skill.cprExpiration ?  this.skill.cprExpiration : null ,
          value: this.skill.cpr ? this.skill.cpr : null,
          verificationDate: this.skill.cprVerification ? this.skill.cprVerification : null
      };

      if (item1.value && this.isValid(item1.expirationDate)) {  EditSkills.push(item1);  }

      const item2 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("ProfessionalLicense"),
          generalComplianceItem: "ProfessionalLicense",
          employeeId: this.employeeId,
          expirationDate: this.skill.professionalLicenseExpiration ? this.skill.professionalLicenseExpiration : null,
          value: this.skill.professionalLicenseNumber ? this.skill.professionalLicenseNumber : null,
          verificationDate: this.skill.professionalLicenseVerification ? this.skill.professionalLicenseVerification : null
      };

      if (item2.value && this.isValid(item2.expirationDate)) { EditSkills.push(item2); }

      const item3 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("DriverLicense"),
          generalComplianceItem: "DriverLicense",
          employeeId: this.employeeId,
          expirationDate: this.skill.driversLicenseExpiration ? this.skill.driversLicenseExpiration : null,
          value: this.skill.driversLicenseId ? this.skill.driversLicenseId : null,
          verificationDate: this.skill.driversLicenseVerification ? this.skill.driversLicenseVerification : null
      };

      if (item3.value && this.isValid(item3.expirationDate)) { EditSkills.push(item3); }

      const item4 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("AutoInsurance"),
          generalComplianceItem: "AutoInsurance",
          employeeId: this.employeeId,
          expirationDate: this.skill.automobileInsuranceExpiration ? this.skill.automobileInsuranceExpiration : null,
          value: this.skill.automobileInsurance ? this.skill.automobileInsurance : null,
          verificationDate: this.skill.automobileInsuranceVerification ? this.skill.automobileInsuranceVerification : null
      };

      if (this.isValid(item4.expirationDate)) { EditSkills.push(item4); }

      const item5 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("MalpracticeInsurance"),
          generalComplianceItem: "MalpracticeInsurance",
          employeeId: this.employeeId,
          expirationDate: this.skill.malpracticeInsuranceExpiration ? this.skill.malpracticeInsuranceExpiration : null,
          value: this.skill.malpracticeInsurance ? this.skill.malpracticeInsurance : null,
          verificationDate: this.skill.malpracticeInsuranceVerification ? this.skill.malpracticeInsuranceVerification : null
        };

      if (this.isValid(item5.expirationDate)) { EditSkills.push(item5); }

      const item6 = {
          employeeGeneralComplianceItemId: this.isGeneralComplianceItem("NPI"),
          generalComplianceItem: "NPI",
          employeeId: this.employeeId,
          expirationDate: this.skill.npiExpiration ? this.skill.npiExpiration : null,
          value: this.skill.npi ? this.skill.npi : null,
          verificationDate: this.skill.npiVerification ? this.skill.npiVerification : null
      };

      if (item6.value) { EditSkills.push(item6); }
      console.log(EditSkills);

      this.employeeService.saveSkillInfo(this.employeeId, EditSkills).subscribe((res) => {

        this.toasterService.pop('success', 'You updated Skill info successfully');
        this.onClose.next(res);
        this.modalRef.hide();
      },
      error => {
        this.toasterService.pop('error', 'Could not update Skill info');
        console.log('Error saving Skill info', error);
        this.modalRef.hide();
      });

  }

  isValid(value: Date): boolean {
      if (!value) {
      return false;
    }

    const today = moment(new Date());
    const expiration = moment(value);
    const daysDiff = moment.duration(expiration.diff(today)).asDays();

    if (daysDiff <= 0) {
      return false;
    }
    return true;
  }

  isGeneralComplianceItem(name: any): number {

    for ( const skill of this.skills) {
      if (skill.generalComplianceItemName === name) {
          return  skill.employeeGeneralComplianceItemId;
      }
    }

    return 0;
  }
}
