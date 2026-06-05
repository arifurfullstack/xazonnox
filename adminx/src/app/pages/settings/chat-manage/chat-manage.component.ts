import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {CHAT_TYPES, OFFER_TYPES} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat-manage',
  templateUrl: './chat-manage.component.html',
  styleUrl: './chat-manage.component.scss'
})
export class ChatManageComponent implements OnInit, OnDestroy {
  // Store Data
  readonly chatTypes: Select[] = CHAT_TYPES;

  chats: any[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  isLoading: boolean = false;

  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Init Data Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();

  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Chat');
    this.pageDataService.setPageData({
      title: 'Chat',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Chat', url: null},
      ]
    })
  }


  /**
   * FORMS METHODS
   * initFormGroup()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      url: [null],
      chatType: [null],
      status: [null],
    });
  }


  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    if (this.formViewMode === 'add') {
      const data = {
        ...this.dataForm.value,
        ...{
          status: 'active'
        }
      }
      this.chats.push(data);
      this.selectedIndex = this.chats.length - 1;
      this.sortDeliveryCharges();
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.chats.findIndex(f => f.chatType === this.dataForm.value.chatType);
      this.chats[fIndex] = {
        ...this.chats[fIndex],
        ...this.dataForm.value,
      }
      this.addSetting()
    }
  }


  /**
   * HTTP REQ HANDLE
   * addSetting()
   * getSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('chats')
      .subscribe({
        next: res => {
          if (res.data && res.data.chats) {
            this.chats = res.data.chats;
            if (this.chats.length) {
              this.onSelectItem(0);
            }
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  private addSetting() {
    this.isLoading = true;
    const data = {
      chats: this.chats
    };

    const subscription = this.settingService.addSetting(data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, "success");
          } else {
            this.uiService.message(res.message, "warn");
          }

          if (this.formViewMode === 'add') {
            this.formViewMode = '';
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }


  /**
   * UI Logics
   * onAddNewDeliveryType()
   * toggleCheckbox()
   * onSelectItem()
   * sortDeliveryCharges()
   * isDisabledOpt()
   */
  onAddNewDeliveryType() {
    this.formViewMode = 'add';
    const missingTypes = this.chatTypes.filter(
      (deliveryType) =>
        !this.chats.some(
          (charge) => charge.chatType === deliveryType.value
        )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({type: this.chatTypes[0].value});
    } else {
      this.dataForm.patchValue({type: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.chats[index].status;
    this.chats[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.chats[this.selectedIndex]);
  }

  private sortDeliveryCharges(): void {
    const typeOrder = this.chatTypes.map((type) => type.value);
    this.chats.sort(
      (a, b) => typeOrder.indexOf(a.chatType) - typeOrder.indexOf(b.chatType)
    );
  }

  isDisabledOpt(type: string): boolean {
    return this.chats.some(charge => charge.chatType === type);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
