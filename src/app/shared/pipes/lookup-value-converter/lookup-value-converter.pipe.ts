import { Pipe, PipeTransform } from '@angular/core';

import { Lookup } from './../../../core/models/lookup';


@Pipe({
  name: "convertLookup"
})
export class LookupValueConverterPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (!value || !args) {
      return "<span class='fa fa-spinner fa-spin'></span>";
    }
    if (args.length === 0 || !(args[0] instanceof Array)) {
      return "N/A";
    }
    const itemByValue = (<Lookup[]>args[0]).find(e => e.key === value);
    if (!itemByValue) {
      return "N/A";
    }
    return itemByValue.name;
  }
}
