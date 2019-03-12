export class EmployeeInformationModel {
  constructor(
    public employeeTypeId: number,
    public employmentTypeId: number,
    public isActiveEmployeeType: boolean,
    public applicationDate: Date,
    public hireDate: Date,
    public agencyInsuranceStatus: number,
    public primaryWorkPlaceId: number,
    public liveIn: boolean,
    public liveInNumDays: number,
    public isDriver: boolean,
    public isPDN: boolean,
    public employmentStatusLastUpdated?: Date,
    public firstWorkDate?: Date,
    public lastWorkDate?: Date
  ) { }
}
