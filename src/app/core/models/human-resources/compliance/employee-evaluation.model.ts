export class EmployeeEvaluationModel {
  constructor(
    public evaluationId: number,
    public EvaluationName: string,
    public active: boolean,
    public required: boolean,
    public expires: boolean,
    public expiresAfterMonths: number,
    public isInsuranceEvaluation: boolean,
    public insuranceId: number,
    public isPationtId: number
  ) {
  }
}
