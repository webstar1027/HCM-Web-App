import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }

    const valueStr: string = value.toString();

    if (valueStr.length === 10) {
      const areaCode = valueStr.substr(0, 3);
      const officeCode = valueStr.substr(3, 3);
      const number = valueStr.substr(6);

      return `(${areaCode}) ${officeCode}-${number}`;
    }

    return value;
  }

}
