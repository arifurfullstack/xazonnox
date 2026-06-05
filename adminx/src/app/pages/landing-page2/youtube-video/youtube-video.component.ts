import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./youtube-video.component.scss']
})
export class YoutubeVideoComponent {
  @Input() singleLandingPage!: any;
  @Input() cartSaleSubTotal!: number;
}
