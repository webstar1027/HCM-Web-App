import { Directive, Input, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';

@Directive({
  selector: '[requiredIf]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: RequiredIfValidatorDirective,
    multi: true
  }]
})
export class RequiredIfValidatorDirective implements Validator {
  @Input("requiredIf") requiredIf: boolean;

  constructor() { }

  validate(c: AbstractControl) {
    // console.log('Called REquiredIf', c, this.requiredIf);
    let value = c.value;
    if ((value == null || value == undefined || value == "") && this.requiredIf) {
            return {
                requiredIf: {condition:this.requiredIf}
            };
      }
    return null;
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }
 
    private _onChange: () => void;
   
    ngOnChanges(changes: SimpleChanges): void {
    
       if ('requiredIf' in changes) {
         
         if (this._onChange) this._onChange();
       }
     }
  }