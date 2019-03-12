import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'expired'
})
export class ExpiredPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const today = moment(new Date());
    const expiration = moment(value);
    const daysDiff = moment.duration(expiration.diff(today)).asDays();

    let result = expiration.format('MM/DD/YYYY');
    if (daysDiff <= 0) {
      result = `Expired on ${result}`;
    }

    if (args) {
      result = `${args} - ${result}`;
    }

    return result;
  }

}
