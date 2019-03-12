import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'genderConvert' })
export class GenderConverterPipe implements PipeTransform {
  transform(value) {

    if (typeof value !== 'string' && !(value instanceof String)) {
      return value;
    }
    const val: String = value.toString().toLowerCase().trim();
    let returnValue = '';
    switch (val) {
      case 'm':
        returnValue = 'Male';
        break;
      case 'f':
        returnValue = 'Female';
        break;
      default:
        break;
    }

    return returnValue;
  }
}
