import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { ReferralDemographics } from '@app/core/models';
import { LookupTypesEnum } from '@app/core/lookup-types-enum';
import { LookupService, ReferralService } from '@app/core/services';
import { Location } from "@angular/common";
import { NewReferralAboutContactComponent } from './new-referral-about-contact/new-referral-about-contact.component';
import { ToasterService } from 'angular2-toaster';
import { NewReferralEmergencyContactsComponent } from './new-referral-emergency-contacts/new-referral-emergency-contacts.component';
import { DialogService } from '@app/core/guards/guard-dialog.service';
import { NewReferralMedicaidIntakeComponent } from './new-referral-medicaid-intake/new-referral-medicaid-intake.component';
import { NewReferralClinicalCoordinationComponent } from './new-referral-clinical-coordination/new-referral-clinical-coordination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-referral-wizard',
  templateUrl: './new-referral-wizard.component.html',
  styleUrls: ['./new-referal-wizard.scss']
})
export class NewReferralWizardComponent implements OnInit {
  newReferral = {} as ReferralDemographics;
  isCurrentlySavingNewReferral: boolean = false;
  relationshipList: any;
  languageList: any;
  @ViewChild(NewReferralAboutContactComponent) aboutContactStep;
  @ViewChild(NewReferralEmergencyContactsComponent) emergencyContactsStep;
  @ViewChild(NewReferralMedicaidIntakeComponent) medicaidIntakeStep;
  @ViewChild(NewReferralClinicalCoordinationComponent) clinicalCoordinationStep;

  constructor(
    private lookupService : LookupService,
    private router: Router,
    private toaster : ToasterService,
    public dialogService: DialogService,
    private referralService : ReferralService
  ) { }

  validateAboutContactForm(direction) : boolean{
    if(this.aboutContactStep.aboutForm.valid) return true;
    else{
      this.toaster.pop('error', 'Required Fields', 'Please fill out the About Form before continuing');
      this.aboutContactStep.aboutForm._directives.forEach(model => {
        model.control.markAsTouched();
      });
      return this.aboutContactStep.aboutForm.valid;
    }

  }

  saveNewReferral() : void{
    this.referralService.addNewReferral(this.newReferral)
      .subscribe(response => {
        this.toaster.pop("success", "Saved", response.firstName);
        this.router.navigateByUrl('referral/list');
      },
      e => {
        this.toaster.pop("error", "Error Saving", e.error);
        return;
      })
  }

  finishFunction(){
    if(this.emergencyContactsStep.form.valid){
      this.emergencyContactsStep.addEmergencyContact();
      console.log(this.newReferral.emergencyContact);
      this.saveNewReferral();
      sweetAlert({
        title: 'YAY! You finsihed!',
        text: 'This is just a TEST',
        icon: 'info',
        buttons: [false, true]
      });
    }
    else if(this.emergencyContactsStep.emergencyContacts.length >0 && this.emergencyContactsStep.form.pristine){
      this.saveNewReferral();
      sweetAlert({
        title: 'YAY! You finsihed!',
        text: 'This is just a TEST',
        icon: 'info',
        buttons: [false, true]
      });
    }
    else if(this.emergencyContactsStep.emergencyContacts.length >0){
      this.toaster.pop("error", "Incomplete Form", "Please Complete or Clear the form to continue");
      this.emergencyContactsStep.form._directives.forEach(model => {
        model.control.markAsTouched();
      });
    }
    else{
      this.toaster.pop('error', 'Required Fields', 'Please fill out the Form before continuing');
      this.emergencyContactsStep.form._directives.forEach(model => {
        model.control.markAsTouched();
      });
    }
  }
  
  cancel(){
    console.log(this.aboutContactStep.aboutForm);
    
    this.router.navigateByUrl('referral/list');
    console.log('Cancel Button! After back');
  }
  
  ngOnInit() {
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.RelationshipLookupService).subscribe(e => { this.relationshipList = e; });
    this.lookupService.getEnumNameValueLookup(LookupTypesEnum.LanguageLookupService).subscribe(e => { this.languageList = e; });

    this.newReferral.chartId = 0;
    this.newReferral.referralId = 0;
    this.newReferral.emergencyContact = [];
  }
}
