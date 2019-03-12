export class EmployeeListModel {
  constructor(public employeeId: number,
    public firstName: string,
    public lastName: string,
    public middleName: string,
    public dob: Date
  ) { }

  public get fullName(): string {
    return `${this.firstName} ${this.middleName || ''} ${this.lastName}`;
  }
}
