import { IAddress } from "../shared/IAddress";
import { IContact } from "../shared/IContact";
import { IEmergencyContact } from "../shared/IEmergencyContact";
import { PhysicianModel } from "../../physician-model";
import { ChartAuthorization, ChartContract } from "./IChartAuthorization";

export interface IChart {
  chartId: number;
  firstName: string;
  lastName: string;
  middleInitial: string;
  nickName: string;
  dateOfBirth: Date;
  socialSecurity: string;
  gender: string;
  billingAddress: IAddress;
  serviceAddress: IAddress;
  mailingAddress: IAddress;
  homePhone: IContact;
  cellPhone: IContact;
  fax: IContact;
  email: IContact;
  medicaidMemberId: string;
  medicareMemberId: string;
  medicaidStatus: string;
  entitlementIssues: Boolean;
  maximusDate: Date;
  maximusScore: string;
  emergencyContact: IEmergencyContact[];
  coveredForMedicaid: Boolean;
  facilityName: string;
  entitlementIssuesComment: string;
  medicaidComment: string;
  sabbathObservant?: boolean;
  attendsSocialDayCare: boolean;
  primaryLanguageId: number;
  otherGenderAcceptanceId: number;
  genderPreferenceId: number;
  dayCareId: number;
  chartPhysicians: ChartPhysician[];
  chartAuthorizations: ChartAuthorization[];
  chartContracts?: ChartContract[];

}

export class ChartPhysician {
  chartPhysicianId: number;
  physicianId: number;
  isPrimary: boolean;
  memo?: string;
  physician: PhysicianModel;
}

