import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Component, OnInit } from '@angular/core';
import { IEmergencyContact, IContact } from "@app/core/models";
import { Observable } from "rxjs";
import { Validator } from '@app/core/helper/validator';
import { ToasterService } from 'angular2-toaster';

import {
  EmergencyContactComponent
} from '../../../referral/partials/emergency-contact/emergency-contact.component';

import { ReferralService } from '../../../../core/services';
import { MedicaidEditComponent } from '@app/routes/referral/partials/medicaid-edit/medicaide-edit.component';

@Component({
    moduleId: module.id,
    selector: 'app-demographics',
    templateUrl: 'patient-demographics.component.html',
    styleUrls: ['patient-demographics.component.scss']
})
export class PatientDemographicsComponent implements OnInit {
  patientDemographics: any;
  private referralId: number;
  loadingEmergencyContacts = true;
  deletingEmergencyContact = false;
  deletingEmergencyContactContactId: number;

  private emergencyContactModalRef: BsModalRef;
  private medicaidMedicareEditModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private validator: Validator,
    private referralService: ReferralService,
    private toasterService: ToasterService,
    private modalService: BsModalService
  ) {}

  private loadEmergencyContacts(): void {
    this.referralService
      .getChartEmergencyContacts(this.patientDemographics.chartId)
      .subscribe(
        e => {
          this.patientDemographics.emergencyContact = e;
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

  ngOnInit() {
    this.route.parent.data.subscribe((res) => {
        this.patientDemographics = res.patient;

        this.loadEmergencyContacts();
        if (this.patientDemographics.fax == null) { this.patientDemographics.fax = {contactValue: '', contactId: 0, contactType: 4, isDefault: false}; }
        if (this.patientDemographics.email == null) { this.patientDemographics.email = {contactValue: '', contactId: 0, contactType: 5, isDefault: false}; }
        if (this.patientDemographics.cellPhone == null) { this.patientDemographics.cellPhone = {contactValue: '', contactId: 0, contactType: 2, isDefault: false}; }
        if (this.patientDemographics.homePhone == null) { this.patientDemographics.cellPhone = {contactValue: '', contactId: 0, contactType: 1, isDefault: false}; }
    });

    this.route.parent.params.subscribe(r => {
      this.referralId = +r.id;
    });
  }

  savePatientContactInfo(newValue: any): Observable<any> {
    const contacts: Array<any> = [
      this.validator.getValidContact(this.patientDemographics.homePhone),
      this.validator.getValidContact(this.patientDemographics.cellPhone),
      this.validator.getValidContact(this.patientDemographics.fax),
      this.validator.getValidContact(this.patientDemographics.email),
    ].filter(x => x);

    const updateModel = {
      mailingAddress: this.patientDemographics.mailingAddress,
      serviceAddress: this.patientDemographics.serviceAddress,
      contacts: contacts
    };

    return this.referralService.updateReferralContact(this.patientDemographics.referralId, updateModel);
  }

  // savePatientAboutInfo(newValue: any): Observable<any> {

  // }
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
      chartId: this.patientDemographics.chartId,
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
      if (this.patientDemographics.emergencyContact == null) {
        this.patientDemographics.emergencyContact = new Array();
      }
      const indexOfElement = this.patientDemographics.emergencyContact.findIndex(
        e => e.emergencyContactId === result.emergencyContactId
      );
      if (indexOfElement >= 0) {
        this.patientDemographics.emergencyContact[indexOfElement] = result;
      } else {
        this.patientDemographics.emergencyContact.push(result);
      }
    });
  }


  deleteEmergencyContact(emergencyContactId: number): void {
    this.deletingEmergencyContact = true;
    this.deletingEmergencyContactContactId = emergencyContactId;
    this.referralService
      .deleteEmergencyContact(
        this.patientDemographics.chartId,
        emergencyContactId
      )
      .subscribe(
        e => {
          const index = this.patientDemographics.emergencyContact.findIndex(
            contact => contact.emergencyContactId === emergencyContactId
          );
          this.patientDemographics.emergencyContact.splice(index, 1);
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
    const clonedpatientDemographics = JSON.parse(
      JSON.stringify(this.patientDemographics)
    );

    this.medicaidMedicareEditModalRef = this.modalService.show(
      MedicaidEditComponent,
      {
        initialState: {
          referralDemographics: clonedpatientDemographics,
          referralId: this.referralId,
          patient: true
        },
        class: "modal-md"
      }
    );

    // this.medicaidMedicareEditModalRef.content.onClose.subscribe(result => {
    //   if (!result) {
    //     return;
    //   }
    //   this.patientDemographics.lastMaximusDate = result.lastMaximusDate;
    //   this.patientDemographics.lastMaximusScore = result.lastMaximusScore;
    //   this.patientDemographics.medicaidMemberId = result.medicaidNumber;
    //   this.patientDemographics.medicareMemberId = result.medicareNumber;
    //   this.patientDemographics.coveredForMedicaid = result.covered;
    //   this.patientDemographics.entitlementIssues = result.entitlementIssue;
    //   this.patientDemographics.entitlementIssuesComment = result.entitlementIssueComment;
    //   this.patientDemographics.medicaidComment = result.medicaidComment;
    // });
  }



}
