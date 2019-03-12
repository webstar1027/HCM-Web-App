import { IZip } from "./IZip";

export interface IAddress extends IZip {
  addressId: number;
  addressType: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  linkType: string;
}
