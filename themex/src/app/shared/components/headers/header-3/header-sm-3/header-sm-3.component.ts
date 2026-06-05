import {Component, HostListener, inject, Input} from '@angular/core';
import {ImgCtrlPipe} from "../../../../pipes/img-ctrl.pipe";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AppConfigService} from "../../../../../services/core/app-config.service";
import {Cart} from "../../../../../interfaces/common/cart.interface";
import {NavigationService} from "../../../../../services/core/navigation.service";

@Component({
  selector: 'app-header-sm-3',
  standalone: true,
    imports: [
        ImgCtrlPipe,
        NgOptimizedImage,
        RouterLink
    ],
  templateUrl: './header-sm-3.component.html',
  styleUrl: './header-sm-3.component.scss'
})
export class HeaderSm3Component {

  // Theme Settings
  searchHints: string[] = [];

  // Decorator
  @Input() currentUrl: string;
  @Input() carts: Cart[] = [];
  @Input() shopInfo: any;

  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  isHeaderFixed: boolean = false;
  isHeaderTopHidden: boolean = false;

  // Inject
  private readonly appConfigService = inject(AppConfigService);
  private readonly navigationService = inject(NavigationService);

  ngOnInit() {
    // Theme Settings
    this.getSettingData();
  }

  /**
   * Initial Landing Page Setting
   * getSettingData()
   */

  private getSettingData() {
    const searchHintsSetting = this.appConfigService.getSettingData('searchHints');
    const baseResults = searchHintsSetting.split(',').map((item: string) => item.trim());
    this.searchHints = [...baseResults, baseResults[0]];
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderFixed = window.scrollY > 0;
    this.isHeaderTopHidden = window.scrollY > 250;
  }


  get isVisible() {
    if (this.currentUrl === '/search') {
      return false;
    }else {
      return true;
    }
  }

  goBack(): void {
    this.navigationService.back();
  }
}
