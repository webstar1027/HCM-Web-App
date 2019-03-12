import { Component, OnInit, TemplateRef } from "@angular/core";
import { ToasterService, ToasterConfig } from "angular2-toaster";
import { BsModalService, BsModalRef } from "ngx-bootstrap";

import { ActivatedRoute, Router } from "@angular/router";

import { ReferralDemographics } from "../../../../core/models/referral/referral-demographics";
import { AddressManagementService } from "../../../../core/services/components/address-management.service";
import { CityStateInfo } from "../../../../core/models/components/city-state-info-model";
import { ReferralService } from "../../../../core/services/referral/referral.service";
import { EmergencyContactComponent } from "../../partials/emergency-contact/emergency-contact.component";
import { IEmergencyContact, IContact } from "../../../../core/models";
import { MedicaidEditComponent } from "../../partials/medicaid-edit/medicaide-edit.component";
import { Validator } from "../../../../core/helper/validator";
import { debug } from "util";
import { SsnPipe, GenderConverterPipe } from "@app/shared/pipes";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import { Pipe } from "@angular/compiler/src/core";

@Component({
  selector: "app-referral-demographics",
  templateUrl: "./referral-demographics.component.html",
  styleUrls: ["./referral-demographics.component.scss"]
})
export class ReferralDemographicsComponent implements OnInit {
  referralDemographics: ReferralDemographics;
  editChartContact: any;
  private referralId: number;
  loadingEmergencyContacts = true;
  deletingEmergencyContact = false;
  deletingEmergencyContactContactId: number;
  serviceAddressEditZipCode: string;
  mailingAddressEditZipCode: string;
  isCurrentlySavingChartContacts = false;
  serviceAddressEditCityState: CityStateInfo = null;
  mailingAddressEditCityState: CityStateInfo = null;
  ssnPipe: Pipe = SsnPipe;
  genderPipe: Pipe = GenderConverterPipe;
  datePipe: Pipe = DatePipe;

  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  sreviceCityStateIsLoading = false;
  mailingAddressCityStateIsLoading = false;

  private modalRef: BsModalRef;
  private emergencyContactModalRef: BsModalRef;
  private medicaidMedicareEditModalRef: BsModalRef;
  constructor(
    private toasterService: ToasterService,
    private modalService: BsModalService,
    private addressService: AddressManagementService,
    private route: ActivatedRoute,
    private validator: Validator,
    private referralService: ReferralService
  ) {}

  openEmergencyContactModal(emergencyContact?: IEmergencyContact): void {
    if (emergencyContact) {
      emergencyContact.cellPhone = emergencyContact.cellPhone
        ? emergencyContact.cellPhone
        : { contactType: 2, contactValue: "", isDefault: false, contactId: 0 };

      emergencyContact.homePhone = emergencyContact.homePhone
        ? emergencyContact.homePhone
        : { contactType: 1, contactValue: "", isDefault: false, contactId: 0 };

      emergencyContact.email = emergencyContact.email
        ? emergencyContact.email
        : { contactType: 5, contactValue: "", isDefault: false, contactId: 0 };
    }
    const clonedEmergencyContact = !emergencyContact
      ? emergencyContact
      : (JSON.parse(JSON.stringify(emergencyContact)) as IEmergencyContact);

    const initialState = {
      chartId: this.referralDemographics.chartId,
      emergencyContact: clonedEmergencyContact
    };
    this.emergencyContactModalRef = this.modalService.show(
      EmergencyContactComponent,
      { initialState, class: "modal-lg" }
    );
    this.emergencyContactModalRef.content.onClose.subscribe(result => {
      if (result == null) {
        return;
      }
      if (this.referralDemographics.emergencyContact == null) {
        this.referralDemographics.emergencyContact = new Array();
      }
      const indexOfElement = this.referralDemographics.emergencyContact.findIndex(
        e => e.emergencyContactId === result.emergencyContactId
      );
      if (indexOfElement >= 0) {
        this.referralDemographics.emergencyContact[indexOfElement] = result;
      } else {
        this.referralDemographics.emergencyContact.push(result);
      }
    });
  }

  closeEmergencyContactModal(): void {
    this.emergencyContactModalRef.hide();
  }

  saveEditable(e: any): void {}

  openContactModal(template: TemplateRef<any>) {
    // console.log(template);
    if(!this.referralDemographics.serviceAddress) {
      this.referralDemographics.serviceAddress = {
        "addressId": 0,
        "addressType": 1,
        "addressLine1": "",
        "addressLine2": null,
        "city": "",
        "county":"",
        "state": "",
        "zip": '',
        "linkType": "referral"
      };
    }
    if(!this.referralDemographics.mailingAddress) {
      this.referralDemographics.mailingAddress = {
        "addressId": 0,
        "addressType": 1,
        "addressLine1": "",
        "addressLine2": null,
        "city": "",
        "county": "",
        "state": "",
        "zip": '',
        "linkType": "referral"
      };
    }
    const clonedObject = JSON.parse(
      JSON.stringify(this.referralDemographics)
    ) as ReferralDemographics;
    this.editChartContact = {
      mailingAddress: clonedObject.mailingAddress,
      serviceAddress: clonedObject.serviceAddress,

      homePhone: clonedObject.homePhone
        ? clonedObject.homePhone
        : { contactType: 1, contactValue: "" },
      cellPhone: clonedObject.cellPhone
        ? clonedObject.cellPhone
        : { contactType: 2, contactValue: "" },
      fax: clonedObject.fax
        ? clonedObject.fax
        : { contactType: 3, contactValue: "" },
      email: clonedObject.email
        ? clonedObject.email
        : { contactType: 5, contactValue: "" }
    };

    console.log(clonedObject);
    this.serviceAddressEditZipCode = this.referralDemographics.serviceAddress.zip;
    this.mailingAddressEditZipCode = this.referralDemographics.mailingAddress.zip;

    this.serviceAddressEditCityState = new CityStateInfo(
      this.referralDemographics.serviceAddress.city,
      this.referralDemographics.serviceAddress.state,
      this.referralDemographics.serviceAddress.zip,
      "",
      true
    );

    this.mailingAddressEditCityState = new CityStateInfo(
      this.referralDemographics.mailingAddress.city,
      this.referralDemographics.mailingAddress.state,
      this.referralDemographics.mailingAddress.zip,
      "",
      true
    );

    this.modalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  closeContactModal(): void {
    this.modalRef.hide();
  }

  saveChartContactInfo(): void {
    this.isCurrentlySavingChartContacts = true;
    const contacts: Array<any> = [
      this.validator.getValidContact(this.editChartContact.homePhone),
      this.validator.getValidContact(this.editChartContact.cellPhone),
      this.validator.getValidContact(this.editChartContact.fax),
      this.validator.getValidContact(this.editChartContact.email)
    ].filter(x => x); // Add a null contact if it has no value, And filter to only get the list of not null contacts

    const updateModel = {
      mailingAddress: this.editChartContact.mailingAddress,
      serviceAddress: this.editChartContact.serviceAddress,
      contacts: contacts
    };
    console.log(updateModel);
    this.referralService
      .updateReferralContact(this.referralDemographics.referralId, updateModel)
      .subscribe(
        re => {
          try {
            this.referralDemographics.mailingAddress = re.data.mailingAddress;
            this.referralDemographics.serviceAddress = re.data.serviceAddress;
console.log(re);
            const contactsArray = re.data.contacts as Array<IContact>;

            this.referralDemographics.homePhone = contactsArray.find(
              e => e.contactType === 1
            );

            this.referralDemographics.cellPhone = contactsArray.find(
              e => e.contactType === 2
            );
            this.referralDemographics.fax = contactsArray.find(
              e => e.contactType === 4
            );
            this.referralDemographics.email = contactsArray.find(
              e => e.contactType === 5
            );
            // Close the modal after saving
            this.modalRef.hide();
          } catch (e) {
            this.toasterService.pop("error", "Error refreshing");
            console.error(e);
          }
          this.isCurrentlySavingChartContacts = false;
        },
        failure => {
          this.toasterService.pop(
            "error",
            "Could not save Contact",
            failure.message
          );
          this.isCurrentlySavingChartContacts = false;
        }
      );
  }

  deleteEmergencyContact(emergencyContactId: number): void {
    this.deletingEmergencyContact = true;
    this.deletingEmergencyContactContactId = emergencyContactId;
    this.referralService
      .deleteEmergencyContact(
        this.referralDemographics.chartId,
        emergencyContactId
      )
      .subscribe(
        e => {
          const index = this.referralDemographics.emergencyContact.findIndex(
            contact => contact.emergencyContactId === emergencyContactId
          );
          this.referralDemographics.emergencyContact.splice(index, 1);
          this.deletingEmergencyContact = false;
          this.deletingEmergencyContactContactId = null;
          this.toasterService.pop(
            "success",
            "Emergency Contact Update",
            "Contact deleted"
          );
        },
        failed => {
          this.toasterService.pop(
            "error",
            "Error Delete Emegency Contacts",
            failed.message
          );
          this.deletingEmergencyContact = false;
          this.deletingEmergencyContactContactId = null;
        }
      );
  }

  editMedicaidAndMedicare() {
    const clonedReferralDemographics = JSON.parse(
      JSON.stringify(this.referralDemographics)
    );

    this.medicaidMedicareEditModalRef = this.modalService.show(
      MedicaidEditComponent,
      {
        initialState: {
          referralDemographics: clonedReferralDemographics,
          referralId: this.referralId
        },
        class: "modal-md"
      }
    );

    this.medicaidMedicareEditModalRef.content.onClose.subscribe(result => {
      if (!result) {
        return;
      }
      this.referralDemographics.maximusDate = result.lastMaximusDate;
      this.referralDemographics.maximusScore = result.lastMaximusScore;
      this.referralDemographics.medicaidMemberId = result.medicaidNumber;
      this.referralDemographics.medicareMemberId = result.medicareNumber;
      this.referralDemographics.coveredForMedicaid = result.covered;
      this.referralDemographics.entitlementIssues = result.entitlementIssue;
      this.referralDemographics.entitlementIssuesComment = result.entitlementIssueComment;
      this.referralDemographics.medicaidComment = result.medicaidComment;
    });
  }

  private loadEmergencyContacts(): void {
    this.referralService
      .getChartEmergencyContacts(this.referralDemographics.chartId)
      .subscribe(
        e => {
          this.referralDemographics.emergencyContact = e;
          this.loadingEmergencyContacts = false;
        },
        f => {
          this.toasterService.pop(
            "error",
            "Error Loading Emegency Contacts",
            f.message
          );
          this.loadingEmergencyContacts = false;
        }
      );
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe(r => {
      this.referralDemographics = r.referral;
      this.loadEmergencyContacts();
      if (this.referralDemographics.fax == null) {
        this.referralDemographics.fax = {contactValue: '', contactId: 0, contactType: 4, isDefault: false};
      }
      if (this.referralDemographics.email == null) {
        this.referralDemographics.email = {contactValue: '', contactId: 0, contactType: 5, isDefault: false};
      }
      if (this.referralDemographics.cellPhone == null) {
        this.referralDemographics.cellPhone = {contactValue: '', contactId: 0, contactType: 2, isDefault: false};
      }
      if (this.referralDemographics.homePhone == null) {
        this.referralDemographics.cellPhone = {contactValue: '', contactId: 0, contactType: 1, isDefault: false};
      }
    });
    this.route.parent.params.subscribe(r => {
      this.referralId = +r.id;
    });
  }

  getMailingCityState(e) {
    if (!e || String(e).length !== 5) {
      if (e === this.mailingAddressEditZipCode) {
        return;
      }
      this.mailingAddressEditCityState = null;
      return;
    }
    this.mailingAddressCityStateIsLoading = true;
    return this.addressService.getCityStateByZip(e).subscribe(
      res => {
        this.mailingAddressEditCityState = res;
        this.editChartContact.mailingAddress.city = res.city;
        this.editChartContact.mailingAddress.state = res.state;
        this.editChartContact.mailingAddress.zip = e;
        this.mailingAddressCityStateIsLoading = false;
      },
      error => {
        this.mailingAddressCityStateIsLoading = false;
      }
    );
  }

  getCityState(e) {
    if (!e || String(e).length !== 5) {
      this.serviceAddressEditCityState = null;
      return;
    }
    this.sreviceCityStateIsLoading = true;
    return this.addressService.getCityStateByZip(e).subscribe(
      res => {
        this.serviceAddressEditCityState = res;

        this.editChartContact.serviceAddress.city = res.city;
        this.editChartContact.serviceAddress.state = res.state;
        this.editChartContact.serviceAddress.zip = e;

        this.sreviceCityStateIsLoading = false;
      },
      failure => {
        this.sreviceCityStateIsLoading = false;
      }
    );
  }

  saveReferralContactInfo(newValue: any): Observable<any> {
    const contacts: Array<any> = [
      this.validator.getValidContact(this.referralDemographics.homePhone),
      this.validator.getValidContact(this.referralDemographics.cellPhone),
      this.validator.getValidContact(this.referralDemographics.fax),
      this.validator.getValidContact(this.referralDemographics.email)
    ].filter(x => x)

    const updateModel = {
      mailingAddress: this.referralDemographics.mailingAddress,
      serviceAddress: this.referralDemographics.serviceAddress,
      contacts: contacts
    };
    return this.referralService
      .updateReferralContact(this.referralDemographics.referralId, updateModel)
    }

}
