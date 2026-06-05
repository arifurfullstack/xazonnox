import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {UiService} from '../../services/core/ui.service';
import {environment} from '../../../environments/environment';
import {VendorService} from '../../services/vendor/vendor.service';
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../services/core/utils.service";
import {StorageService} from "../../services/core/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  // Basic
  readonly env = environment;
  readonly year = new Date().getFullYear();
  passwordVisibility = false;
  // Reactive Form
  dataForm: FormGroup;
  passwordStrength: string = 'weak';
  // Loading
  isLoading: boolean = false;
  countryCode = '+88'
  // Services
  private readonly uiService = inject(UiService);
  private readonly title = inject(Title);
  private readonly vendorService = inject(VendorService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);
  private readonly storageService = inject(StorageService);
  private readonly activatedRoute = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    // Set SEO Meta Data
    this.seoMetaData();

    // Initialize the main reactive form
    this.initDataForm();

    // Get Pre shop Data
    this.activatedRoute.queryParams.subscribe(qParam => {
      const phoneNo = qParam['phoneNo'];
      const secret = qParam['secret'];

      if (phoneNo && secret) {
        this.dataForm.patchValue({
          identifier: phoneNo,
          password: secret
        });

        this.onSubmit()
      }
    });


  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      identifier: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Invalid Input field!', 'warn');
      return;
    }

    if (this.dataForm.value.identifier.length < 5) {
      this.uiService.message('Username must be at least 5 character!', 'warn');
      this.dataForm.controls['username'].setErrors({'incorrect': true});
      return;
    }

    if (this.dataForm.value.password.length < 5) {
      this.uiService.message('Password must be at least 5 character!', 'warn');
      this.dataForm.controls['password'].setErrors({'incorrect': true});
      return;
    }

    this.isLoading = true;

    try {
      const deviceId = this.storageService.getDeviceId(); // ✅ Step 1: Get device ID from localStorage
      const userAgent = navigator.userAgent; // ✅ Step 2: Get browser user-agent string

      const payload = {
        ...this.dataForm.value,
        deviceId,
        userAgent,
      };

      console.log("payload", payload);

      await this.vendorService.userLogin(payload);
      this.isLoading = false;
    } catch (err) {
      if (err && err.error && err.error.error) {
        this.uiService.message(`[${err.error.error}] ${err.error.message && err.error.message.length ? err.error.message[0] : ''}`, 'warn');
      }
      this.isLoading = false;
    }

  }




  checkPasswordStrength() {
    const hasMinLength = this.dataForm.value.password.length >= 6;

    if (hasMinLength) {
      this.passwordStrength = 'strong';
    } else {
      this.passwordStrength = 'weak';
    }
  }


  private seoMetaData() {
    // Title
    this.title.setTitle('Admin Login');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.dataForm.get(field);
    return control.invalid && control.touched;
  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  navigateToForgetPassword() {
    this.router.navigate(['reset-password'], {
      queryParams: {
        navigateFrom: this.utilsService.removeUrlQuery(this.router.url),
        phoneNo: this.dataForm.value.username
      }
    }).then();
  }


  storys = [
    {
      images: ['/assets/login/Admin-banner2-01.png']
    },
    {
      images: ['/assets/login/Admin-banner-01.png']
    },
  ]

  /**
   * ngOnDestroy()
   */
  ngOnDestroy() {
    this.isLoading = false;
  }

}
