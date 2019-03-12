import { IStatus } from "../interfaces/shared/IStatus";

export class ReferralEnrollmentModel {
  enrollmentId: number;
  referralId: number;
  statusId: number;
  enrollmentDate: Date;
  insuranceId: number;
  statusName: string;
  approveStartDate?: Date;
  enrollmentStatus: IStatus;
  insurance: InsuranceModel;
  denialReasonId?: number;
}

export class InsuranceModel {
  insuranceId: number;
  insuranceName: string;
  billingName: string;
}
