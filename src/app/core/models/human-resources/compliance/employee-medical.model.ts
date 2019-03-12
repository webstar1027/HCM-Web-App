export class EmployeeMedicalModel {
  constructor(
    public employeeMedicalId: number,
    public employeeId: number,
    public organizationMedicalId: number,
    public dateReceived: Date,
    public expirationDate: Date,
    public resultId: number
  ) {

  }
}
