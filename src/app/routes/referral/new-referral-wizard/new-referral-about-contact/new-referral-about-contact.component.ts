import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ReferralDemographics, IAddress, IContact } from '@app/core/models';
import { AddressManagementService } from '@app/core/services';
import { ToasterService } from 'angular2-toaster';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-referral-about-contact',
  templateUrl: './new-referral-about-contact.component.html'
})
export class NewReferralAboutContactComponent implements OnInit {
  @Input() newReferral: ReferralDemographics;

  @ViewChild('referralContactForm') aboutForm: NgForm;
  dobPattern =[ /[0-1]/,/[0-9]/,'/', /[0-3]/,/[0-9]/,'/', /[1-2]/,/[0-9]/,/[0-9]/,/[0-9]/];
  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  socialSecurityMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-',/\d/, /\d/, /\d/, /\d/]
  invalidZipCode: string;
  private lastZipCode = "";
  today = new Date();
  aLongTimeAgo = new Date();
  showSetHomePrimary: boolean = false;
  showSetCellPrimary: boolean = false;
  showSetEmailPrimary: boolean = false;

  differentMailingAddress: boolean = false;
  invalidMailZipCode: string;
  showNickname: boolean;
  
  constructor(
    private addressService: AddressManagementService,
    private toasterService: ToasterService
  ) { 
    this.aLongTimeAgo.setFullYear(this.aLongTimeAgo.getFullYear()-120);
  }

  setPrimary(contact: IContact) {
    if (!contact || !contact.contactValue || (contact.contactValue.length < 8 && typeof contact.contactValue === 'number' )) {
      this.toasterService.pop(
        "error",
        "Set Primary",
        "Primary Contact Method Must Have a Value"
      );
    } else {
      this.newReferral.homePhone.isDefault = false;
      this.newReferral.cellPhone.isDefault = false;
      this.newReferral.email.isDefault = false;
      contact.isDefault = true;
    }
  }

  openMailingAddress(){
    this.differentMailingAddress = !this.differentMailingAddress;
    this.newReferral.mailingAddress = {
      "addressId": 0,
      "addressType": 1,
      "addressLine1": "",
      "addressLine2": null,
      "city": "",
      "county":"",
      "state": "",
      "zip": '',
      "linkType": "referral"
    }
  }

  restrictNumeric(e) {
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

  lookupZipCode(zipCode, serviceAddress){
    if (!zipCode || zipCode.length < 5 || zipCode === this.lastZipCode) {
      return;
    }
    this.lastZipCode = zipCode;
    this.addressService.getCityStateByZip(zipCode).subscribe(e => {
      if(serviceAddress){
        if (e.isValid === false) {
          this.invalidZipCode = "Invalid Zip Code";
          this.newReferral.serviceAddress.city = null;
          this.newReferral.serviceAddress.state = null;
        } else {
          this.invalidZipCode = null;
          this.newReferral.serviceAddress.city = e.city;
          this.newReferral.serviceAddress.state = e.state;
        }
      }
      else{
        if (e.isValid === false) {
          this.invalidMailZipCode = "Invalid Zip Code";
          this.newReferral.mailingAddress.city = null;
          this.newReferral.mailingAddress.state = null;
        } else {
          this.invalidZipCode = null;
          this.newReferral.mailingAddress.city = e.city;
          this.newReferral.mailingAddress.state = e.state;
        }
      }
    });
  }

  toggleNickname(){
    this.showNickname = !this.showNickname;
  }


  ngOnInit() {
    this.newReferral.homePhone = {} as IContact;
    this.newReferral.cellPhone = {} as IContact;
    this.newReferral.fax = {} as IContact;
    this.newReferral.email = {} as IContact;
    this.newReferral.serviceAddress = {} as IAddress;
  }

}
