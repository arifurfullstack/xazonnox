import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  imports: [
    RouterLink
  ],
  standalone: true
})
export class TitleComponent {
  @Input() title: string;
  @Input() urlTitle: string;
  @Input() url: string;
}
