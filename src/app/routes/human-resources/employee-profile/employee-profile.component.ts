import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeService } from '@app/core/services/human-resources/employee.service';
import { EmployeeDemographicsModel, EmployeeInformationModel } from '@app/core/models';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  employee: EmployeeDemographicsModel;
  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) { }
  ngOnInit() {
    this.route.data.subscribe(data => {
      const jsonObj = data['employee'] as EmployeeDemographicsModel;
      const info = new EmployeeInformationModel(jsonObj.employeeTypeId,
        jsonObj.employmentTypeId, jsonObj.isActiveEmployeeType,
        jsonObj.applicationDate, jsonObj.hireDate, jsonObj.agencyInsuranceStatus, jsonObj.primaryWorkPlaceId, jsonObj.liveIn,
        jsonObj.liveInNumDays, jsonObj.isDriver, jsonObj.isPDN, jsonObj.employmentStatusLastUpdated, jsonObj.firstWorkDate,
        jsonObj.lastWorkDate);

      this.employee = new EmployeeDemographicsModel(jsonObj.employeeId, jsonObj.firstName, jsonObj.lastName, jsonObj.middleName,
        jsonObj.dob, jsonObj.gender, jsonObj.ssn, jsonObj.address, jsonObj.homePhone, jsonObj.cellPhone, jsonObj.maritalStatus,
        jsonObj.ethnicityId, jsonObj.countryOfBirthId, jsonObj.ethnicity, jsonObj.country, jsonObj.emailAddress, jsonObj.workEmail,
        jsonObj.defaultCommunicationType, jsonObj.primaryLanguageId, jsonObj.language, jsonObj.picture, jsonObj.emergencyContacts, info);

      this.employeeService.setCurrentEmployeeId(jsonObj.employeeId);
      this.employeeService.setCurrentDemographics(this.employee);
    });

    this.subscription = this.employeeService.getUpdatedDemographics().subscribe(demographics => {
      this.employee = demographics;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
