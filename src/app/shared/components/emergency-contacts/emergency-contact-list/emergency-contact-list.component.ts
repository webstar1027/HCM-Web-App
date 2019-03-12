import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

import 'sweetalert';

import { EmergencyContactEditorComponent } from '@app/shared/components/emergency-contacts/emergency-contact-editor/emergency-contact-editor.component';
import { IEmergencyContact, IContact } from '@app/core/models';


@Component({
  selector: 'app-emergency-contact-list',
  templateUrl: './emergency-contact-list.component.html',
  styleUrls: ['./emergency-contact-list.component.scss']
})
export class EmergencyContactListComponent {
  private emergencyContactModalRef: BsModalRef;

  deletingEmergencyContact = false;
  deletingEmergencyContactId = -1;

  @Input() contacts: IEmergencyContact[];
  @Input() saveCallback: (emergencyContact: IEmergencyContact) => Observable<any>;
  @Input() deleteCallback: (emergencyContactId: number) => Observable<any>;

  @Output() contactSaved = new EventEmitter<IEmergencyContact>();
  @Output() contactDeleted = new EventEmitter<number>();

  constructor(
    private modalService: BsModalService,
    private toasterService: ToasterService
  ) { }

  deleteContact(contactId: number): void {
    sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this emergancy contact!',
      icon: 'warning',
      buttons: [true, true],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete && !!this.deleteCallback) {
        this.deletingEmergencyContact = true;
        this.deletingEmergencyContactId = contactId;
        this.deleteCallback(contactId).subscribe(() => {
          this.contactDeleted.emit(contactId);

          this.deletingEmergencyContact = false;
          this.deletingEmergencyContactId = -1;

          this.toasterService.pop(
            'success',
            'Emergency Contact Update',
            'Contact deleted'
          );
        },
        error => {
          this.deletingEmergencyContact = false;
          this.deletingEmergencyContactId = -1;

          this.toasterService.pop(
            'error',
            'Error Delete Emegency Contacts',
            error.message
          );
        });
      }
    }).catch(() => {
      this.deletingEmergencyContact = false;
      this.deletingEmergencyContactId = -1;
    });
  }

  openEditModal(emergencyContact: IEmergencyContact): void {
    if (emergencyContact) {
      emergencyContact.homePhone = emergencyContact.homePhone || this.getDefaultHomePhone();
      emergencyContact.cellPhone = emergencyContact.cellPhone || this.getDefaultCellPhone();
      emergencyContact.email = emergencyContact.email || this.getDefaultEmail();
    }

    const clonedEmergencyContact = JSON.parse(
      JSON.stringify(emergencyContact)
    ) as IEmergencyContact;

    const initialState = {
      saveCallback: this.saveCallback,
      editingContact: clonedEmergencyContact
    };

    this.emergencyContactModalRef = this.modalService.show(
      EmergencyContactEditorComponent,
      { initialState, class: 'modal-lg' }
    );

    this.emergencyContactModalRef.content.onSave.subscribe(contact => {
      this.contactSaved.emit(contact);
    });
  }

  private getDefaultContact(contactType: number): IContact {
    return {
      contactType: contactType,
      contactValue: '',
      isDefault: false,
      contactId: 0
    };
  }

  private getDefaultHomePhone(): IContact {
    return this.getDefaultContact(1);
  }

  private getDefaultCellPhone(): IContact {
    return this.getDefaultContact(2);
  }

  private getDefaultEmail(): IContact {
    return this.getDefaultContact(5);
  }
}
