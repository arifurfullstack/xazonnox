import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cod',
  standalone: true
})
export class CodPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '-';
    if (value === 'Cash on Delivery') {
      return 'COD';
    } else if (value === 'SSl Commerz') {
      return 'SSL'
    } else {
      return value;
    }
  }

}
