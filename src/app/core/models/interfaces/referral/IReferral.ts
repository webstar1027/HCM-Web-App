import { IStatus } from "../shared/IStatus";

export interface IReferral {
  referralId: number;
  nursingHomeDischarge: boolean;
  transferCase: boolean;
  referralStatus: string;
  patientStatus: string;
  referralDenialReasonId: number;
  referredBy: string;
  referredByOrganization: string;
  referralReason: string;
  referralStatusId: number;
  referralSubStatusId: number;
  referredById: number;
  referralSourceId: number;
  referralAssessments: IReferralAssessment[];
  intakeCoordinatorId: number;
}

export interface IReferralAssessment {
  referralAssessmentId: number;
  referralId: number;
  assessmentDate: Date;
  assessmentStatus: IStatus;
  nurseId: number;
  nurseName: string;
}


