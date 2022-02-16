import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short'
})
export class ShortPipe implements PipeTransform {

  transform(str: string | undefined, start: number, end: number): string {
    if (!str) {
      return '';
    }
    return `${str.substring(0, start)}...${str.substring(str.length - end, str.length)}`;
  }

}
