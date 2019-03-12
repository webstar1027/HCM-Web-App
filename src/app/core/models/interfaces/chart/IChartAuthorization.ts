import { NoteModel } from "../../notes/note-model";
import { DocumentModel } from "../../documents/document-model";


export class ChartAuthorization{
  chartAuthorizationId: number;
  enrollmentId: number;
  chartContractId: number;
  verbalAuthorization: boolean;
  authorizationNumber: string;
  authorizationDetails: AuthorizationDetails[];
  authorizationNotes: NoteModel;
}

export class AuthorizationDetails {
  chartAuthorizationDetailId: number;
  chartAuthorizationId: number;
  authorizationDate: Date;
  startDate: Date;
  endDate: Date;
  terminatedforHospitalization: boolean;
  insuranceServiceCodeId:number;
  unitType: string;
  period: string;
  units: number;
  weekdaysUOM: string;
  weekdaysValue: any;
  sunUnits: number;
  monUnits: number;
  tueUnits: number;
  wedUnits: number;
  thuUnits: number;
  friUnits: number;
  satUnits: number;
  maxUnitsForAuthorization: number;
  authorizationNotes: NoteModel[];
  linkedDocument: DocumentModel;
}

export class ChartContract{
  chartContractId: number;
  chartId: number;
  insuranceId: number;
  memberId: string;
  effectiveDate: Date;
  endDate: Date;
  episodeId: string;
}