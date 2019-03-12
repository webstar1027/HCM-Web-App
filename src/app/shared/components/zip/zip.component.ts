import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NG_VALIDATORS, NG_VALUE_ACCESSOR, AbstractControl, ControlValueAccessor, FormControl, Validator, ValidationErrors } from '@angular/forms';

import { AddressManagementService } from '@app/core/services';
import { IZip } from '@app/core/models/interfaces';


@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ZipComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: ZipComponent, multi: true }
  ]
})
export class ZipComponent implements ControlValueAccessor, Validator {

  private lastZipRequest: string;
  private lastZipIsValid: boolean;

  zipData: IZip;
  isDataValid = true;

  @ViewChild('zipControl') zipControl: FormControl;

  @Output() zipChange = new EventEmitter();

  @Input() smallControl = false;
  @Input() required = false;
  @Input() disabled = false;

  @Input()
  get zipInfo(): IZip {
    return this.zipData;
  }

  set zipInfo(value: IZip) {
    this.zipData = value;
  }

  private changedSubscriber = (value: any) => {};
  private touchedSubscriber = () => {};

  writeValue(obj: any): void {
    if (obj) {
      this.zipInfo = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.changedSubscriber = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedSubscriber = fn;
  }

  validate(control: AbstractControl): ValidationErrors {
    if (!this.isDataValid) {
      return { 'invalidZip': true };
    }

    return this.zipControl.errors;
  }

  constructor(private addressService: AddressManagementService) { }

  zipChanged(e): void {
    if (e && e.target.value && e.target.value.length === 5) {
      const zip = e.target.value;

      if (this.lastZipRequest !== zip) {
        this.lastZipRequest = zip;
        this.zipData.city = '';
        this.zipData.state = '';
        this.addressService.getCityStateByZip(zip).subscribe(resp => {
          this.isDataValid = resp.isValid;

          if (resp.isValid) {
            this.zipData.city = resp.city;
            this.zipData.state = resp.state;
            this.changedSubscriber(this.zipInfo);
          }
        }, error => {
          console.log('Error during checking ZIP', error);
          this.isDataValid = false;
        }, () => {
          this.lastZipIsValid = this.isDataValid;
        });
      } else {
        this.isDataValid = this.lastZipIsValid;
      }
    } else {
      this.isDataValid = (false || (e.target.value.length === 0 && !this.required)) && !!this.lastZipRequest;
    }

    this.changedSubscriber(this.zipInfo);
    this.touchedSubscriber();
    this.zipChange.emit(this.zipData);
  }
}
