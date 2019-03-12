import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

import { AddressManagementService, LookupService } from '@app/core/services';

import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { IAddress, IContact, IEmergencyContact, Lookup } from '@app/core/models';


@Component({
  selector: 'app-emergency-contact-editor',
  templateUrl: './emergency-contact-editor.component.html',
  styleUrls: ['./emergency-contact-editor.component.scss']
})
export class EmergencyContactEditorComponent implements OnInit {
  private lastZipCode = '';

  @ViewChild('emergencyContactForm') emergencyContactForm: NgForm;

  @Input() saveCallback: (contact: IEmergencyContact) => Observable<any>;

  editingContact: IEmergencyContact;
  relationshipList: Lookup[];
  invalidZipCode: string;

  onSave = new EventEmitter<IEmergencyContact>();

  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private modalRef: BsModalRef,
    private toasterService: ToasterService,
    private lookupService: LookupService,
    private addressService: AddressManagementService
  ) { }

  ngOnInit() {
    if (!this.editingContact) {
      this.editingContact = this.getNewContact();
    } else if (!this.editingContact.addresses) {
      this.editingContact.addresses = [ this.getNewAddress() ];
    }

    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.RelationshipLookupService).subscribe(e => { this.relationshipList = e; });
  }

  setPrimary(contact: IContact) {
    if (!contact || !contact.contactValue || contact.contactValue.length < 8) {
      this.toasterService.pop(
        'error',
        'Set Primary',
        'Primary Contact Method Must Have a Value'
      );
    } else {
      this.editingContact.homePhone.isDefault = false;
      this.editingContact.cellPhone.isDefault = false;
      this.editingContact.email.isDefault = false;
      contact.isDefault = true;
    }
  }

  restrictNumeric(e: KeyboardEvent) {
    let input;
    if (e.metaKey || e.ctrlKey || (e.which < 33 && e.which !== 32)) {
      return true;
    }

    input = String.fromCharCode(e.which);
    const isDigit = !!/[\d\s]/.test(input);
    return isDigit;
  }

  save(): void {
    if (this.emergencyContactForm.valid) {
      if (!this.emergencyContactForm.dirty) {
        this.modalRef.hide();
      }

      if (this.saveCallback) {
        this.saveCallback(this.editingContact).subscribe(response => {
          this.onSave.next(response);
          this.modalRef.hide();
        }, error => {
          this.toasterService.pop('error', 'Error Saving', error);
        });
      }
    }
  }

  cancel(): void {
    this.modalRef.hide();
  }

  private getNewContact(): IEmergencyContact {
    return {
      emergencyContactId: 0,
      name: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
      nickName: '',
      homePhone: {
        contactId: 0,
        contactType: 1,
        contactValue: '',
        isDefault: false
      },
      cellPhone: {
        contactId: 0,
        contactType: 2,
        contactValue: '',
        isDefault: false
      },
      email: {
        contactId: 0,
        contactType: 5,
        contactValue: '',
        isDefault: false
      },
      relationshipId: 0,
      addresses: [ this.getNewAddress() ]
    };
  }

  private getNewAddress(): IAddress {
    return {
      addressId: 0,
      addressLine1: '',
      addressLine2: '',
      addressType: 1,
      city: '',
      state: '',
      zip: '',
      county: '',
      linkType: 'EmergencyContact'
    };
  }
}
