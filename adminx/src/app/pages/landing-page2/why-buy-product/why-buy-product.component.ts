import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-why-buy-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-buy-product.component.html',
  styleUrl: './why-buy-product.component.scss'
})
export class WhyBuyProductComponent {
  @Input() singleLandingPage: any;
  @Input() cartSaleSubTotal: any;

  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedDescription(): SafeHtml {
    if (this.singleLandingPage?.whyBuyDescription) {
      return this.sanitizer.bypassSecurityTrustHtml(this.singleLandingPage.whyBuyDescription);
    }
    return '';
  }

  scrollToPayment() {
    const paymentElement = document.getElementById('payment');
    if (paymentElement) {
      paymentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
