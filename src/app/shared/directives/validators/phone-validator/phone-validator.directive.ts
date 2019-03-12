import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPhoneValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PhoneValidatorDirective,
    multi: true
  }]
})
export class PhoneValidatorDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    const formatedRegEx = new RegExp(/\(\d{3}\) \d{3}-\d{4}/);
    const regEx = new RegExp(/\d{10}/);
    if (control.value && !(formatedRegEx.test(control.value) || regEx.test(control.value))) {
        // console.log('Phone Validator False');
      return { valid: false };
    }
    // console.log('Phone Validator True');

    return null;
  }

}
