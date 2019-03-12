import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NewReferralWizardComponent } from '@app/routes/referral/new-referral-wizard/new-referral-wizard.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<NewReferralWizardComponent> {
  canDeactivate(component: NewReferralWizardComponent): Observable<boolean> | Promise<boolean> | boolean{
    if(component.aboutContactStep.aboutForm.dirty || component.medicaidIntakeStep.form.dirty || component.clinicalCoordinationStep.form.dirty || component.emergencyContactsStep.form.dirty){
      console.log('Gaurd called');
      return component.dialogService.confirm('Your data will be lost.');
    }
    else{
      return true;
    }
  }
}
