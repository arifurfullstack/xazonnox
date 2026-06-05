import { Component } from '@angular/core';
@Component({
  selector: 'app-manage-websites',
  templateUrl: './manage-websites.component.html',
  styleUrl: './manage-websites.component.scss',
})
export class ManageWebsitesComponent {
  activeCardIndex: number | null = null;
  setActiveCard(index: number): void {
    // If the card is clicked again, deactivate it
    this.activeCardIndex = this.activeCardIndex === index ? null : index;
  }
}
