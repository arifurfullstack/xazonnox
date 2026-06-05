import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'paymentStatus',
  standalone: true
})
export class PaymentStatusPipe implements PipeTransform {

  transform(data: any): string {
    if (!data.paymentStatus) return '-';
    if (data.paymentStatus === 'paid') {
      return 'Paid';
    } else if (data.paymentStatus === 'unpaid' && data?.advancePayment > 0) {
      return 'Advance';
    } else {
      return data.paymentStatus;
    }
  }

}
