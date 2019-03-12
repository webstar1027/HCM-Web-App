export class EmploymentAuthorizationModel {
  constructor(
    public i9Document1TypeId: number,
    public i9Document1Expiration: Date,
    public i9Document1ReceiptReceived: boolean,
    public i9Document2TypeId: number,
    public i9Document2Expiration: Date,
    public i9Document2ReceiptReceived: boolean,
    public verified: boolean,
    public reference: string,
    public additionalReference: string,
    public lastEmploymentAgency: string,
    public lastEmploymentFrom: Date,
    public lastEmploymentTo: Date,
    public exclusionListCheckedOn: Date,
    public cpr: boolean,
    public cprExpiration: Date,
    public cprVerification: Date,
    public malpracticeInsuranceExpiration: Date,
    public malpracticeInsuranceVerification: Date,
    public npi: number,
    public professionalLicenseNumber: number,
    public professionalLicenseExpiration: Date,
    public professionalLicenseVerification: Date,
    public driversLicenseId: number,
    public driversLicenseExpiration: Date,
    public driversLicenseVerification: Date,
    public automobileInsuranceExpiration: Date,
    public automobileInsuranceVerification: Date,
    public malpracticeInsurance: string,
    public npiExpiration: Date,
    public npiVerification: Date,
    public automobileInsurance: string
  ) {
  }
}
