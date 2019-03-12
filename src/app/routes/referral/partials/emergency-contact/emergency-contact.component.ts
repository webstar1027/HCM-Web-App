import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs/Subject";

import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { ToasterService } from "angular2-toaster";

import { IContact, IEmergencyContact, Lookup } from "../../../../core/models";
import { AddressManagementService, ReferralService, LookupService } from "../../../../core/services";
import { LookupTypesEnum } from "@app/core/lookup-types-enum";

@Component({
  selector: "app-ec-modal",
  templateUrl: "./emergency-contact.component.html"
})
export class EmergencyContactComponent implements OnInit {
  @ViewChild("emergencyContactForm") form;
  emergencyContact: IEmergencyContact = null;
  chartId: number;
  relationshipList: Lookup[];
  public onClose: Subject<IEmergencyContact>;
  private lastZipCode = "";
  invalidZipCode: string;
  showSetHomePrimary: boolean = false;
  showSetCellPrimary: boolean = false;
  showSetEmailPrimary: boolean = false;
  savingInfo:boolean = false;

  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    public bsModalRef: BsModalRef,
    private lookupService: LookupService,
    private addressService: AddressManagementService,
    private toasterService: ToasterService,
    private referralService: ReferralService
  ) {
    this.onClose = new Subject();
  }

  cancel(): void {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }

  save(): void {
    try {
      this.savingInfo = true;
      this.referralService
        .updateReferralEmergencyContact(this.chartId, this.emergencyContact)
        .subscribe(
          response => {
            this.emergencyContact = response;
            this.savingInfo = false;
            this.onClose.next(this.emergencyContact);
            this.bsModalRef.hide();
          },
          e => {
            this.savingInfo = false;
            this.toasterService.pop("error", "Error Saving", e.error);
            return;
          }
        );
    } catch (e) {
      return;
    }
  }

  setPrimary(contact: IContact) {
    if (!contact || !contact.contactValue || contact.contactValue.length < 8) {
      this.toasterService.pop(
        "error",
        "Set Primary",
        "Primary Contact Method Must Have a Value"
      );
    } else {
      this.emergencyContact.homePhone.isDefault = false;
      this.emergencyContact.cellPhone.isDefault = false;
      this.emergencyContact.email.isDefault = false;
      contact.isDefault = true;
    }
  }

  public restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    const isDigit = !!/[\d\s]/.test(input);
    return isDigit;
  }

  lookupZipCode(zipCode: string) {
    if (!zipCode || zipCode.length < 5 || zipCode === this.lastZipCode) {
      return;
    }
    this.lastZipCode = zipCode;
    this.addressService.getCityStateByZip(zipCode).subscribe(e => {
      if (e.isValid === false) {
        this.invalidZipCode = "Invalid Zip Code";
        this.emergencyContact.addresses[0].city = null;
        this.emergencyContact.addresses[0].state = null;
      } else {
        this.invalidZipCode = null;
        this.emergencyContact.addresses[0].city = e.city;
        this.emergencyContact.addresses[0].state = e.state;
      }
    });
  }

  ngOnInit(): void {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.RelationshipLookupService).subscribe(e => { this.relationshipList = e; });
    
    if (!this.emergencyContact === false) {
      return;
    }
    
    this.emergencyContact = {
      emergencyContactId: 0,
      firstName: "",
      lastName: "",
      middleInitial: "",
      nickName: "",
      cellPhone: {
        contactId: 0,
        contactType: 2,
        contactValue: "",
        isDefault: false
      },
      homePhone: {
        contactId: 0,
        contactType: 1,
        contactValue: "",
        isDefault: false
      },
      email: {
        contactId: 0,
        contactType: 5,
        contactValue: "",
        isDefault: false
      },
      addresses: new Array({
        addressId: 0,
        addressLine1: "",
        addressLine2: "",
        addressType: 1,
        city: "",
        state: "",
        zip: "",
        county: "",
        linkType: "Chart"
      }),
      relationshipId: 1,
      name: null
    };
  }
}
