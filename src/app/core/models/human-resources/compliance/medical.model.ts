export class MedicalModel {
  constructor(
    public medicalId: number,
    public medicalName: string,
    public required: boolean,
    public expirable: boolean,
    public expiresAfterMonths: number,
    public resultSetId: number
  ) {
  }
}
