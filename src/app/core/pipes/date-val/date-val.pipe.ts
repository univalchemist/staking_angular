import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';

@Pipe({
  name: 'dateVal'
})
export class DateValPipe implements PipeTransform {
  transform(value: string): string {
    const date = moment(new Date(+value));

    if (!date.isValid()) {
      return value;
    }

    return date.format('MMM DD, YYYY');
  }
}
