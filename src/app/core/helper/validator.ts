import { Injectable } from "@angular/core";
import { IContact } from "../models/interfaces/shared/IContact";

@Injectable()
export class Validator {
  public getValidContact(contact: IContact): IContact {
    if (!contact) {
      return null;
    }
    if (contact.contactId && contact.contactId !== 0) {
      return contact;
    }
    if (!contact.contactValue) {
      return null;
    }
    if (contact.contactValue.length <= 0) {
      return null;
    }
    return contact;
  }
}
