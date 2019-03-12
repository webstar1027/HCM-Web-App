import { IContact } from "./IContact";
import { IAddress } from "../..";

export interface IEmergencyContact {
  name: string;
  cellPhone: IContact;
  homePhone: IContact;
  email: IContact;
  relationshipId: number;
  addresses: IAddress[];
  firstName: string;
  lastName: string;
  middleInitial: string;
  nickName: string;
  emergencyContactId: number;
}

export class CoordinatorModel {
  coordinatorId: number;
  firstName: string;
  middleInitial: string;
  lastName: string;
  fullName(): string {
    const _fullName = `${this.lastName}, ${this.firstName} ${this.middleInitial}`;
    return _fullName;
  }
}
