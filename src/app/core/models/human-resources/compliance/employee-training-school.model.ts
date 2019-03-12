export class EmployeeTrainingSchoolModel {
  constructor(
    public employeeTrainingSchoolId: number,
    public employeeId: number,
    public trainingSchoolId: number,
    public certificationDate: Date,
    public instructor: string,
    public verified: boolean,
    public verifiedOn: Date,
    public onFile: boolean
  ) {

  }
}
