import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true,
  imports: []
})
export class SignUpComponent {

  // Inject
  private router = inject(Router);

  /**
   * Handle Route
   */
  handleRoute(value: string) {
    this.router.navigate([value]);
  }
}
