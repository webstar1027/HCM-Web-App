import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ssn'
})
export class SsnPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const str: string = value.toString();
    const lastDigits = str.substr(str.length - 4);

    return `*****${lastDigits}`;
  }

}
