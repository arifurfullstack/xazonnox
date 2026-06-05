import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.scss'
})
export class DropZoneComponent {

  @Output() newItemEvent = new EventEmitter();
  @Output() onDeleteOldImage = new EventEmitter<string[]>();
  files: File[] = [];
  @Input() fileNotPicked: boolean = false;
  @Input() images: string[] = [];


  constructor(
  ) { }


  /**
   * IMAGE DRUG & DROP
   * onSelect()
   * onRemove()
   */
  onSelect(event: { addedFiles: any; }) {
    if (event) {
      this.files.push(...event.addedFiles);
      this.newItemEvent.emit(this.files);
    }
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
    this.newItemEvent.emit(this.files);
  }

  removeOldImage(index: number) {
    this.images.splice(index, 1);
    this.onDeleteOldImage.emit(this.images);
  }
}

