import { EmployeeInformationModel } from './employee-information.model';
import { EmployeeListModel } from './employee-list.model';
import { IAddress, IContact, ICountry, IEmergencyContact, IEthnicity, ILanguage } from '../interfaces';

export class EmployeeDemographicsModel extends EmployeeListModel {

  public employeeTypeId: number;
  public isActiveEmployeeType: boolean;
  public employmentTypeId: number;
  public applicationDate: Date;
  public hireDate: Date;
  public agencyInsuranceStatus: number;
  public primaryWorkPlaceId: number;
  public liveIn: boolean;
  public liveInNumDays: number;
  public isDriver: boolean;
  public isPDN: boolean;
  public employmentStatusLastUpdated?: Date;
  public firstWorkDate?: Date;
  public lastWorkDate?: Date;

  constructor(employeeId: number,
    firstName: string,
    lastName: string,
    middleName: string,
    dob: Date,
    public gender: string,
    public ssn: number,
    public address: IAddress,
    public homePhone: IContact,
    public cellPhone: IContact,
    public maritalStatus: string,
    public ethnicityId: number,
    public countryOfBirthId: number,
    public ethnicity: IEthnicity,
    public country: ICountry,
    public emailAddress: IContact,
    public workEmail: IContact,
    public defaultCommunicationType: number,
    public primaryLanguageId: number,
    public language: ILanguage,
    public picture: string,
    public emergencyContacts: IEmergencyContact[],
    public employeeInformation: EmployeeInformationModel
  ) {
    super(employeeId, firstName, lastName, middleName, dob);

    this.employeeTypeId = employeeInformation.employeeTypeId;
    this.isActiveEmployeeType = employeeInformation.isActiveEmployeeType;
    this.employmentTypeId = employeeInformation.employmentTypeId;
    this.applicationDate = employeeInformation.applicationDate;
    this.hireDate = employeeInformation.hireDate;
    this.agencyInsuranceStatus = employeeInformation.agencyInsuranceStatus;
    this.primaryWorkPlaceId = employeeInformation.primaryWorkPlaceId;
    this.liveIn = employeeInformation.liveIn;
    this.liveInNumDays = employeeInformation.liveInNumDays;
    this.isDriver = employeeInformation.isDriver;
    this.isPDN = employeeInformation.isPDN;
    this.employmentStatusLastUpdated = employeeInformation.employmentStatusLastUpdated;
    this.firstWorkDate = employeeInformation.firstWorkDate;
    this.lastWorkDate = employeeInformation.lastWorkDate;
  }

  public get liveInString(): string {
    return this.liveIn ? `Yes - ${this.liveInNumDays} days a week` : 'No';
  }

  public clone(): EmployeeDemographicsModel {
    const employeeInformation = new EmployeeInformationModel(this.employeeTypeId, this.employmentTypeId, this.isActiveEmployeeType,
      this.applicationDate, this.hireDate,
      this.agencyInsuranceStatus, this.primaryWorkPlaceId, this.liveIn, this.liveInNumDays, this.isDriver, this.isPDN,
      this.employmentStatusLastUpdated, this.firstWorkDate, this.lastWorkDate);

    const address: IAddress = {
      addressId: this.address.addressId,
      addressLine1: this.address.addressLine1,
      addressLine2: this.address.addressLine2,
      addressType: this.address.addressType,
      city: this.address.city,
      county: this.address.county,
      linkType: this.address.linkType,
      state: this.address.state,
      zip: this.address.zip
    };

    const homePhone: IContact = {
      contactId: this.homePhone.contactId,
      contactType: this.homePhone.contactType,
      contactValue: this.homePhone.contactValue,
      isDefault: this.homePhone.isDefault
    };

    const cellPhone: IContact = {
      contactId: this.cellPhone.contactId,
      contactType: this.cellPhone.contactType,
      contactValue: this.cellPhone.contactValue,
      isDefault: this.cellPhone.isDefault
    };

    const emailAddress: IContact = {
      contactId: this.emailAddress.contactId,
      contactType: this.emailAddress.contactType,
      contactValue: this.emailAddress.contactValue,
      isDefault: this.emailAddress.isDefault
    };

    const workEmail: IContact = {
      contactId: this.workEmail.contactId,
      contactType: this.workEmail.contactType,
      contactValue: this.workEmail.contactValue,
      isDefault: this.workEmail.isDefault
    };

    return new EmployeeDemographicsModel(this.employeeId, this.firstName, this.lastName, this.middleName,
      this.dob, this.gender, this.ssn, address, homePhone, cellPhone, this.maritalStatus,
      this.ethnicityId, this.countryOfBirthId, this.ethnicity, this.country, emailAddress, workEmail,
      this.defaultCommunicationType, this.primaryLanguageId, this.language, this.picture, this.emergencyContacts, employeeInformation);
  }
}
