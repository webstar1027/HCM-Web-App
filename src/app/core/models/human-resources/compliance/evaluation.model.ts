export class EvaluationModel {
  constructor(
    public employeeEvaluationId: number,
    public employeeId: number,
    public evaluationId: number,
    public completionDate: Date,
    public expirationDate: Date,
    public statusId: number,
    public notes: string,
    public insuranceId: number,
    public patientId: number
  ) {
  }
}
