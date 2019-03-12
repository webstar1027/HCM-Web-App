import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { IEmergencyContact, Lookup, IContact, IAddress } from '@app/core/models';
import { LookupService, AddressManagementService } from '@app/core/services';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { NgForm, NgModel } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-new-referral-emergency-contacts',
  templateUrl: './new-referral-emergency-contacts.component.html'
})
export class NewReferralEmergencyContactsComponent implements OnInit {
  @ViewChild('emergencyContactsForm') form : NgForm;
  @ViewChildren(NgModel) inputs: QueryList<NgModel>;
  @Input() emergencyContacts: IEmergencyContact[];
  contact = {} as IEmergencyContact;
  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  relationshipList: Lookup[];
  invalidZipCode: string;
  showAddress:boolean = false;
  showNickname: boolean;
  showSetHomePrimary: boolean = false;
  showSetCellPrimary: boolean = false;
  showSetEmailPrimary: boolean = false;


  constructor(
    private addressService: AddressManagementService,
    private lookupService: LookupService,
    private toasterService: ToasterService
    ) { }

    toggleAddress(){
      this.showAddress = !this.showAddress;
    }


  restrictNumeric(e){
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

  addEmergencyContact(){
    this.emergencyContacts.push(this.contact);
    console.log(this.emergencyContacts);
    this.inputs.forEach(model => {
      console.log(model);
      model.control.markAsUntouched();
      model.control.markAsPristine();
    });
    this.resetContactInfo();
  }

  setPrimary(contact: IContact){
    if (!contact || !contact.contactValue || (contact.contactValue.length < 8 && typeof contact.contactValue === 'number' )) {
      this.toasterService.pop(
        "error",
        "Set Primary",
        "Primary Contact Method Must Have a Value"
      );
    } else {
      this.contact.homePhone.isDefault = false;
      this.contact.cellPhone.isDefault = false;
      this.contact.email.isDefault = false;
      contact.isDefault = true;
    }
  }

  lookupZipCode(zipCode: string) {
    if (!zipCode || zipCode.length < 5) {
      return;
    }
    this.addressService.getCityStateByZip(zipCode).subscribe(e => {
      if (e.isValid === false) {
        this.invalidZipCode = "Invalid Zip Code";
        this.contact.addresses[0].city = null;
        this.contact.addresses[0].state = null;
      } else {
        this.invalidZipCode = null;
        this.contact.addresses[0].city = e.city;
        this.contact.addresses[0].state = e.state;
      }
    });
  }

  toggleNickname(){
    this.showNickname = !this.showNickname;
  }

  editContact(index){
    this.contact = this.emergencyContacts[index];
    this.emergencyContacts.splice(index, 1);
  }

  removeContact(index){
    this.emergencyContacts.splice(index, 1);
  }

  resetContactInfo(){
    this.contact = {} as IEmergencyContact;
    this.contact.emergencyContactId = 0;
    this.contact.addresses = [];
    this.contact.addresses[0] = {} as IAddress ;
    this.contact.homePhone = {contactId: 0, contactType: 1, isDefault: false} as IContact;
    this.contact.cellPhone = {contactId: 0, contactType: 2, isDefault: false} as IContact;
    this.contact.email = {contactId: 0, contactType: 5, isDefault: false} as IContact;
  }


  ngOnInit() {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.RelationshipLookupService).subscribe(e => { this.relationshipList = e; });
    
    // Initate First Contact
    this.resetContactInfo();
  }

}
