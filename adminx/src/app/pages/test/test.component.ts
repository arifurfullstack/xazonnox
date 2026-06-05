import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ThemeSelectorComponent} from "./theme-selector/theme-selector.component";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {

  // @ViewChild('templateContainer', { static: true }) templateContainer!: ElementRef;
  @ViewChild('templateContainer', { static: false }) templateContainer!: ElementRef;

  selectedData: any;  // Variable to store selected data
  selectedTab: number = 0;  // Variable to manage selected tab

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {

  }
  onPickedImage(event: any) {
    // this.dataForm.patchValue({images: event});
  }
  changeVideo(): void {
    const videoId = prompt('Enter YouTube Video ID:');

    if (videoId === null || videoId.trim() === '') {
      alert('No video ID entered.');
      return;
    }

    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    alert(`Video URL: ${videoUrl}`);

    const iframe = document.getElementById('video') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = videoUrl;
    }
  }


  changeImage(): void {
    const iframe = document.getElementById('video') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${'fr5dXwPwIFc'}`;
    }
  }

  submitTemplate(): void {
    // প্রাথমিক HTML সংগ্রহ করা
    const originalHtml = this.templateContainer.nativeElement.innerHTML;
    // HTML থেকে Angular-র attribute এবং অবাঞ্ছিত class গুলো মুছে ফেলা হচ্ছে
    const cleanedHtml = this.cleanHTML(originalHtml);
    alert('Cleaned HTML logged in console.');
  }

  onContentEdit(): void {
    const editableContent = this.templateContainer.nativeElement.innerHTML;
  }


  cleanHTML(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // প্রথমে, ".ignore" ক্লাসযুক্ত সকল এলিমেন্ট সরিয়ে ফেলা হচ্ছে
    const ignoreElements = tempDiv.querySelectorAll('.ignore');
    ignoreElements.forEach(el => el.remove());

    // সব এলিমেন্ট থেকে Angular-র স্পেসিফিক এবং অবাঞ্ছিত attribute সরিয়ে ফেলা
    const elements = tempDiv.querySelectorAll('*');
    elements.forEach(el => {
      const attributesToRemove: string[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (
          attr.name.startsWith('_ngcontent-') ||
          attr.name.startsWith('_nghost-') ||
          attr.name === 'contenteditable' ||
          attr.name === 'spellcheck'
        ) {
          attributesToRemove.push(attr.name);
        }
        // পূর্বে "guide-area" ক্লাস সরানোর লজিক থাকলে, তা এখানে রাখতে পারেন (যদি প্রযোজ্য হয়)
        if (attr.name === 'class' && el.classList.contains('guide-area')) {
          el.classList.remove('guide-area');
          if (el.classList.length === 0) {
            attributesToRemove.push('class');
          }
        }
      }
      attributesToRemove.forEach(attrName => el.removeAttribute(attrName));
    });

    return tempDiv.innerHTML;
  }

  // Method to set content dynamically for each tab
  setTabData(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  openTemplateEditor() {
    const dialogRef = this.dialog.open(ThemeSelectorComponent, {
        maxWidth: '1200px',
        width: '100%',
        minHeight: '80vh',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.selectedData = dialogResult.theme;
      }
    });
  }

}
