import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';

import 'sweetalert';

import {
  EmployeeContactInfoEditComponent,
  EmployeeEmploymentInfoEditComponent,
  EmployeeGeneralInfoEditComponent
} from '../partials';

import { EmployeeService } from '@app/core/services';

import { EmployeeDemographicsModel, IEmergencyContact } from '@app/core/models';


@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.scss']
})
export class DemographicsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private generalModalRef: BsModalRef;
  private contactModalRef: BsModalRef;
  private employmentModalRef: BsModalRef;

  demographics: EmployeeDemographicsModel;
  demographicsCopy: EmployeeDemographicsModel;

  saveEmergencyContactCallback: (emergencyContact: IEmergencyContact) => Observable<any>;
  deleteEmergencyContactCallback: (emergencyContactId: number) => Observable<any>;

  constructor(
    private modalService: BsModalService,
    private employeeService: EmployeeService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.subscription = this.employeeService
      .getCurrentDemographics()
      .subscribe(employee => {
        this.demographics = employee;
        this.loadEmergencyContacts();
        this.createDemographicsCopy();
      });

    this.saveEmergencyContactCallback = this.saveEmergencyContact.bind(this);
    this.deleteEmergencyContactCallback = this.deleteEmergencyContact.bind(this);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editGeneralInfo() {
    const initialState = {
      demographicsCopy: this.demographicsCopy
    };
    this.generalModalRef = this.modalService.show(
      EmployeeGeneralInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );

    this.generalModalRef.content.onClose.subscribe(result => {
      if (result) {
        if (!result.emergencyContacts) {
          result.emergencyContacts = this.demographics.emergencyContacts;
        }

        this.demographics = result;
        this.employeeService.updateEmployeeDemographics(this.demographics);
      }

      this.createDemographicsCopy();
    });
  }

  editContactInfo() {
    const initialState = {
      demographicsCopy: this.demographicsCopy
    };
    this.contactModalRef = this.modalService.show(
      EmployeeContactInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );

    this.contactModalRef.content.onClose.subscribe(result => {
      if (result) {
        if (!result.emergencyContacts) {
          result.emergencyContacts = this.demographics.emergencyContacts;
        }

        this.demographics = result;
      }

      this.createDemographicsCopy();
    });
  }

  editEmploymentInfo() {
    const initialState = {
      demographicsCopy: this.demographicsCopy
    };
    this.employmentModalRef = this.modalService.show(
      EmployeeEmploymentInfoEditComponent,
      {
        initialState: initialState,
        class: 'modal-lg'
      }
    );

    this.employmentModalRef.content.onClose.subscribe(result => {
      if (result) {
        if (!result.emergencyContacts) {
          result.emergencyContacts = this.demographics.emergencyContacts;
        }

        this.demographics = result;
        this.employeeService.updateEmployeeDemographics(this.demographics);
      }

      this.createDemographicsCopy();
    });
  }

  saveEmergencyContact(emergencyContact: IEmergencyContact): Observable<any> {
    return this.employeeService.saveEmergancyContact(this.demographics.employeeId, emergencyContact);
  }

  deleteEmergencyContact(emergencyContactId: number): Observable<any> {
    return this.employeeService.deleteEmergencyContact(this.demographics.employeeId, emergencyContactId);
  }

  onEmergencyContactSaved(emergencyContact: IEmergencyContact): void {
    if (!emergencyContact) {
      return;
    }

    if (!this.demographics.emergencyContacts) {
      this.demographics.emergencyContacts = new Array();
    }

    const contactIndex = this.demographics.emergencyContacts.findIndex(
      e => e.emergencyContactId === emergencyContact.emergencyContactId
    );

    if (contactIndex >= 0) {
      this.demographics.emergencyContacts[contactIndex] = emergencyContact;
    } else {
      this.demographics.emergencyContacts.push(emergencyContact);
    }
  }

  onEmergencyContactDeleted(emergencyContactId: number): void {
    const index = this.demographics.emergencyContacts.findIndex(
      contact => contact.emergencyContactId === emergencyContactId
    );

    this.demographics.emergencyContacts.splice(index, 1);
  }

  private createDemographicsCopy(): void {
    this.demographicsCopy = this.demographics.clone();
  }

  private loadEmergencyContacts(): void {
    this.employeeService
      .getEmergencyContacts(this.demographics.employeeId)
      .subscribe(
        e => {
          this.demographics.emergencyContacts = e;
          // this.loadingEmergencyContacts = false;
        },
        r => {
          this.toasterService.pop(
            'Error',
            'Error loading Emergency Contacts',
            r.message
          );
          // this.loadingEmergencyContacts = false;
        }
      );
  }
}
