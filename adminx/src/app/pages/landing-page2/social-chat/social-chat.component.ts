import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-chat',
  templateUrl: './social-chat.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./social-chat.component.scss']
})
export class SocialChatComponent {
  @Input() chatLink!: any;
}
