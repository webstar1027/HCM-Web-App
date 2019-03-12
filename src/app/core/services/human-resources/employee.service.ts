import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Configuration } from '@app/core/configuration';

import { Validator } from '@app/core/helper/validator';
import {
  EmployeeListModel,
  EmployeeDemographicsModel,
  EmployeeComplianceModel,
  IEmergencyContact,
  EmployeeMedicalModel,
  EmploymentAuthorizationModel,
  OrganizationMedicalModel,
  CriminalBackgroundCheckModel,
  EmployeeTrainingSchoolModel
} from '@app/core/models';

@Injectable()
export class EmployeeService {

  private currentEmployeeId = new BehaviorSubject<number>(null);
  private currentEmployeeDemographics = new BehaviorSubject<EmployeeDemographicsModel>(null);
  private updatedEmployeeDemographics = new Subject<EmployeeDemographicsModel>();

  constructor(private httpClient: HttpClient, private config: Configuration, private validator: Validator) { }

  public getEmployeeList(): Observable<EmployeeListModel[]> {
    const listApiUrl = `${this.config.ApiBaseUrl}api/employees`;
    return this.httpClient.get<EmployeeListModel[]>(listApiUrl);
  }

  public getEmployeeDemographics(employeeId: number): Observable<EmployeeDemographicsModel> {
    const profileApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}`;
    return this.httpClient.get<EmployeeDemographicsModel>(profileApiUrl);
  }

  public getEmployeeCompliance(employeeId: number): Observable<any> {
    const complianceApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}`;
    return this.httpClient.get<any>(complianceApiUrl);
  }

  public getComplianceMedicals(orgId: number): Observable<any> {
    const complianceMedicalApiUrl = `${this.config.ApiBaseUrl}api/compliance/organization/${orgId}/medicals`;
    return this.httpClient.get<any>(complianceMedicalApiUrl);
  }

  public getGeneralCompliance(employeeId: number): Observable<any> {
    const generalComplianceApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/generalCompliance`;
    return this.httpClient.get(generalComplianceApiUrl);
  }

  public getEmployeeMedical(employeeId: number): Observable<any> {
    const employeeMedicalApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeMedicals`;
    return this.httpClient.get<any>(employeeMedicalApiUrl);
  }

  public getCriminalChecks(employeeId: number): Observable<any> {
      const criminalCheckApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeCriminalChecks`;
      return this.httpClient.get<any>(criminalCheckApiUrl);
  }

  public getTrainingSchools(employeeId: number): Observable<any> {
      const trainingApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeTrainings`;
      return this.httpClient.get<any>(trainingApiUrl);
  }

  public getEvaluations(employeeId: number): Observable<any> {
      const evaluationUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeEvaluations`;
      return this.httpClient.get<any>(evaluationUrl);
  }

  public getCurrentEmployee(employeeId: number): Observable<any> {
    const employeeApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}`;
    return this.httpClient.get(employeeApiUrl);
  }

  public getOrganizationMedicals(orgId: number): Observable<OrganizationMedicalModel[]> {
    const organizationMedicalApiUrl = `${this.config.ApiBaseUrl}api/compliance/${orgId}/medicals`;
    return this.httpClient.get<OrganizationMedicalModel[]>(organizationMedicalApiUrl);
  }

  public saveGeneralInfo(employee: EmployeeDemographicsModel): Observable<EmployeeDemographicsModel> {

    const model = {
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      dob: employee.dob,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      primaryLanguageId: employee.primaryLanguageId,
      ethnicityId: employee.ethnicityId,
      countryOfBirthId: employee.countryOfBirthId,
      ssn: employee.ssn,
    };
    const saveEmployeeUrl = `${this.config.ApiBaseUrl}api/employees/${employee.employeeId}/updateGeneralInfo/`;
    return this.httpClient.post<EmployeeDemographicsModel>(saveEmployeeUrl, model);
  }

  public saveContactInfo(demographics: EmployeeDemographicsModel): any {

    const model = {
      employeeId: demographics.employeeId,
      employeeAddresses: new Array((!demographics.address) ? null : demographics.address).filter(e => e),
      employeeContacts: new Array(this.validator.getValidContact(demographics.homePhone),
                                 this.validator.getValidContact(demographics.cellPhone),
                                 this.validator.getValidContact(demographics.emailAddress),
                                 this.validator.getValidContact(demographics.workEmail)).filter(x => x)
    };

    const updateUrl = `${this.config.ApiBaseUrl}api/employees/${demographics.employeeId}/ContactInfo/update`;
    return this.httpClient.post<EmployeeDemographicsModel>(updateUrl, model);
  }

  public saveEmploymentInfo(employee: EmployeeDemographicsModel): Observable<EmployeeDemographicsModel> {
    const model = {
      employeeTypeId: employee.employeeTypeId,
      applicationDate: employee.applicationDate,
      hireDate: employee.hireDate,
      firstWorkDate: employee.firstWorkDate,
      lastworkDate: employee.lastWorkDate,
      primaryWorkPlaceId: employee.primaryWorkPlaceId,
      agencyInsuranceStatus: employee.agencyInsuranceStatus,
      liveIn: employee.liveIn,
      liveInNumDays: employee.liveInNumDays,
      isDriver: employee.isDriver,
      isPDN: employee.isPDN,
      employmentTypeId: employee.employmentTypeId
    };

    const saveEmployeeUrl = `${this.config.ApiBaseUrl}api/employees/${employee.employeeId}/updateEmploymentInfo/`;
    return this.httpClient.post<EmployeeDemographicsModel>(saveEmployeeUrl, model);
  }

  public getEmergencyContacts(employeeId: number): Observable<IEmergencyContact[]> {
    const url = `${this.config.ApiBaseUrl}api/employees/${employeeId}/emergencyContacts/`;
    return this.httpClient.get<IEmergencyContact[]>(url);
  }

  public saveEmergancyContact(employeeId: number, contact: IEmergencyContact): Observable<IEmergencyContact> {
    const model = {
      emergencyContactId: contact.emergencyContactId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      middleInitial: contact.middleInitial,
      nickName: contact.nickName,
      relationshipId: contact.relationshipId,
      Addresses:  !contact.addresses ? null : contact.addresses.filter(e => e),
      Contacts: new Array(this.validator.getValidContact(contact.homePhone),
                                  this.validator.getValidContact(contact.cellPhone),
                                  this.validator.getValidContact(contact.email)).filter(x => x)
    };
    const url = `${this.config.ApiBaseUrl}api/employees/${employeeId}/emergencyContacts/`;
    return this.httpClient.post<IEmergencyContact>(url, model);
  }

  public deleteEmergencyContact(employeeId: number, ecId: number): Observable<any> {
    const url = `${this.config.ApiBaseUrl}api/employees/${employeeId}/emergencyContacts/${ecId}`;
    return this.httpClient.delete(url);
  }

  public deleteEmployeeMedical(employeeId: number, employeeMedicalId: number): Observable<any> {
    const url =  `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeMedicals/${employeeMedicalId}`;
    return this.httpClient.delete(url);
  }

  public deleteCriminalCheck(employeeId: number, criminalCheckId: number): Observable<any> {
    const url =  `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeCriminalChecks/${criminalCheckId}`;
    return this.httpClient.delete(url);
  }

  public deleteEvaluation(employeeId: number, employeeEvaluationId: number): Observable<any> {
    const url =  `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeEvaluations/${employeeEvaluationId}`;
    return this.httpClient.delete(url);
  }

  public deleteTrainingSchool(employeeId: number, employeeTrainingSchoolId: number): Observable<any> {
    const url =  `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeTrainings/${employeeTrainingSchoolId}`;
    return this.httpClient.delete(url);
  }

  public getCurrentEmployeeId(): Observable<number> {
    return this.currentEmployeeId.asObservable();
  }

  public getCurrentDemographics(): Observable<EmployeeDemographicsModel> {
    return this.currentEmployeeDemographics.asObservable();
  }

  public getUpdatedDemographics(): Observable<EmployeeDemographicsModel> {
    return this.updatedEmployeeDemographics.asObservable();
  }

  public setCurrentEmployeeId(employeeId: number): void {
    this.currentEmployeeId.next(employeeId);
  }

  public setCurrentDemographics(demographics: EmployeeDemographicsModel): void {
    this.currentEmployeeDemographics.next(demographics);
  }

  public updateEmployeeDemographics(demographics: EmployeeDemographicsModel): void {
    this.updatedEmployeeDemographics.next(demographics);
  }

  public saveEmployeeMedical(employeeId: number, medical: any ): Observable<any> {
    const model = {
      employeeMedicalId: medical.employeeMedicalId,
      orgMedicalId: medical.orgMedicalId,
      dateReceived: medical.dateReceived,
      medicalResultId: medical.medicalResultId,
      employeeId: employeeId
    };
    const saveEmployeeUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeMedicals`;
    return this.httpClient.post<EmployeeMedicalModel>(saveEmployeeUrl, model);
  }

  public saveAuthorizationInfo(employeeId: number, authorization: EmploymentAuthorizationModel ): Observable<any> {
    const model = {
      i9Doc1TypeId: authorization.i9Document1TypeId + 1,
      i9Doc1ExpirationDate: authorization.i9Document1Expiration,
      i9Doc1PendingReceiptReceived: authorization.i9Document1ReceiptReceived ,
      i9Doc2TypeId: authorization.i9Document2TypeId + 1,
      i9Doc2ExpirationDate: authorization.i9Document2Expiration,
      i9Doc2PendingReceiptReceived: authorization.i9Document2ReceiptReceived,
      i9DocumentVerified: authorization.verified,
      exclusionListCheckedDate: authorization.exclusionListCheckedOn,
      lastEmploymentAgency: authorization.lastEmploymentAgency,
      lastEmploymentFromDate: authorization.lastEmploymentFrom,
      lastEmploymentToDate: authorization.lastEmploymentTo,
      reference1: authorization.reference,
      reference2: authorization.additionalReference
    };
    const saveAuthorizationUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employmentAuthorization`;
    return this.httpClient.post<EmploymentAuthorizationModel>(saveAuthorizationUrl, model);
  }

  public saveSkillInfo(employeeId: number, skills: any[]): Observable<any> {
    const saveSkillUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/generalCompliance`;
    return this.httpClient.post(saveSkillUrl, skills);
  }

  public saveCriminalCheckInfo(employeeId: number, check: any): Observable<any> {
    const model = {
        employeeCriminalCheckId: check.employeeCriminalCheckId,
        sentOutDate: check.sentOutDate,
        responseReceivedDate: check.responseReceivedDate,
        statusId: check.statusId,
        employeeId: employeeId
    };
    const criminalCheckApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeCriminalChecks`;
    return this.httpClient.post<CriminalBackgroundCheckModel>(criminalCheckApiUrl, model);
  }

  public saveTraningSchoolInfo(employeeId: number, school: any): Observable<any> {

    const model = {
        employeeTrainingId: school.employeeTrainingId,
        trainingSchoolId: school.trainingSchoolId,
        certificationDate: school.certificationDate,
        instructor: school.instructor,
        verified: school.verified,
        verifiedOn: school.verifiedOn,
        onFile: school.onFile,
        employeeId: employeeId
    };

    const schoolInfoApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeTrainings`;
    return this.httpClient.post(schoolInfoApiUrl, model);
  }

  public saveEvaluationInfo(employeeId: number, evaluation: any): Observable<any> {

    const model = {
        employeeEvaluationId: evaluation.employeeEvaluationId,
        orgEvaluationId: evaluation.orgEvaluationId,
        completionDate: evaluation.completionDate,
        status: evaluation.status,
        expirationDate: evaluation.expirationDate,
        employeeId: employeeId
    };

    const evaluationInfoApiUrl = `${this.config.ApiBaseUrl}api/employees/${employeeId}/employeeEvaluations`;
    return this.httpClient.post(evaluationInfoApiUrl, model);
  }
}
