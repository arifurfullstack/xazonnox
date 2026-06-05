import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-no-table-data',
  standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule
    ],
  templateUrl: './no-table-data.component.html',
  styleUrl: './no-table-data.component.scss'
})
export class NoTableDataComponent {

  @Input() matIcon: string = 'loyalty';
  @Input() title: string = 'No Data Added Yet!';
  @Input() desc: string = 'Please add your your data to see here';
  @Input() showActionBtn: boolean = false;
  @Input() actionBtnName: string = 'Clear Filter';
  @Input() actionBtnIcon: string = 'filter_alt';
  @Input() actionBtnColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Output() onActionBtnTrigger = new EventEmitter();


  onClickActionBtn() {
    this.onActionBtnTrigger.emit();
  }
}
