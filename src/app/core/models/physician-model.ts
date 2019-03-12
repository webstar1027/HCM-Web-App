import { IAddress, IContact } from "./interfaces";

export class PhysicianModel {
  public physicianId: number;
  public firstName: string;
  public lastName: string;
  public nPI: string;
  public licenseNumber: string;
  public licenseExpirationDate?: Date;
  public isActive: boolean;
  public addresses: IAddress[];
  public contacts: IContact[];
}
