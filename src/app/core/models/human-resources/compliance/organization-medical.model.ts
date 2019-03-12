export class OrganizationMedicalModel {
  constructor(
    public organizationMedicalId: number,
    public organizationId: number,
    public medicalId: number,
    public medicalName: string,
    public resultSetId: number,
    public active: boolean,
    public required: boolean,
    public expires: boolean,
    public expiresAfterMonths: number
  ) {
  }
}
