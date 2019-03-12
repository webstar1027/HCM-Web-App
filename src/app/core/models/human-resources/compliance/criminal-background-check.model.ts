export class CriminalBackgroundCheckModel {
  constructor(public criminalCheckId: number,
    public employeeId: number,
    public sentOutDate: Date,
    public receivedDate?: Date,
    public checkResult?: string
  ) {
  }
}
