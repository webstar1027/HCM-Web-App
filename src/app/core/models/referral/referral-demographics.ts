import { IChart, ChartPhysician } from "../interfaces/chart/IChart";
import {
  IReferral,
  IReferralAssessment
} from "../interfaces/referral/IReferral";
import { IAddress } from "../interfaces/shared/IAddress";
import { IContact } from "../interfaces/shared/IContact";
import { IEmergencyContact } from "../interfaces/shared/IEmergencyContact";
import { ChartAuthorization } from "../interfaces/chart/IChartAuthorization";

export class ReferralDemographics implements IChart, IReferral {
  public chartId: number;
  public firstName: string;
  public lastName: string;
  public middleInitial: string;
  public nickName: string;
  public dateOfBirth: Date;
  public socialSecurity: string;
  public gender: string;
  public coveredForMedicaid: Boolean;
  public entitlementIssues: Boolean;
  public entitlementIssuesComment: string;
  public medicaidComment: string;
  public medicaidMemberId: string;
  public medicareMemberId: string;
  public maximusDate: Date;
  public maximusScore: string;
  public facilityName: string;
  public medicaidStatus: string;
  public emergencyContact: IEmergencyContact[];

  public billingAddress: IAddress;
  public serviceAddress: IAddress;
  public mailingAddress: IAddress;
  public homePhone: IContact;
  public cellPhone: IContact;
  public fax: IContact;
  public email: IContact;

  public referralId: number;
  public nursingHomeDischarge: boolean;
  public transferCase: boolean;
  public referralStatus: string;
  public patientStatus: string;
  public referralDenialReasonId: number;
  public referredBy: string;
  public referredByOrganization: string;
  public referralReason: string;

  public referralStatusId: number;
  public referralSubStatusId: number;
  public referredById: number;
  public referralSourceId: number;
  public sabbathObservant?: boolean;
  public referralAssessments: IReferralAssessment[];
  public intakeCoordinatorId: number;
  public patientCoordinatorId: number;
  public coordinationComments: string;
  public isCDPAS: boolean;
  public referralCDPASId: number;

  public genderPreferenceId: number;
  public dayCareId: number;
  public attendsSocialDayCare: boolean;
  public primaryLanguageId: number;
  public otherGenderAcceptanceId: number;
  public cdpasAideName: string;
  public cdpasAidePhoneNumber: string;
  public cdpasAideRelationship: string;
  public cdpasAideRateRequest: number;
  public isPDN: boolean;
  public transportationLevelId: number;
  public evacuationZoneId: number;
  public evacuationLocationId: number;
  public chartPhysicians: ChartPhysician[];
  public chartAuthorizations: ChartAuthorization[];

  public fullName(): string {
    const mi = ` ${this.middleInitial}`;
    return `${this.lastName}, ${this.firstName}${mi}`.toUpperCase();
  }
}
