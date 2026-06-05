import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UiService} from "../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VendorDataService} from "../../services/vendor/vendor-data.service";
import {OtpService} from "../../services/common/otp.service";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.startsWith('01') ? null : {invalidPhoneNumber: true};
  };
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  @Input() navigateFrom: string;
  @Input() phoneNo: string;
  // Basic
  readonly env = environment;
  readonly year = new Date().getFullYear();
  // Store Data
  dataForm: FormGroup;
  type: 'password-reset' | '' = '';
  isLoading: boolean = false;
  otpCode: string = null;
  isInvalidOtp: boolean = false;
  isOtpValid: boolean = false;
  countryCode = '+88'

  passwordStrength: string = 'weak';
  passwordVisibility = false;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly otpService = inject(OtpService);
  private readonly router = inject(Router);
  private readonly userDataService = inject(VendorDataService);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Subscription
  private subDataCheck: Subscription;
  private subDataCheck2: Subscription;
  private subDataReset: Subscription;
  private subRoute: Subscription;

  ngOnInit() {
    // Init Form
    this.initDataForm();


    this.subRoute = this.activatedRoute.queryParamMap.subscribe(qParams => {
      if (qParams.get('navigateFrom')) {
        this.navigateFrom = qParams.get('navigateFrom');
      }
      if (qParams.get('phoneNo')) {
        this.phoneNo = qParams.get('phoneNo');
        if (this.phoneNo) {
          console.log('phoneNo', this.phoneNo);
          this.dataForm.patchValue({phoneNo: this.phoneNo});
        }
      }
    })
  }
  onBack() {
    if (this.navigateFrom) {
      this.router.navigate([this.navigateFrom]).then();
    } else {
      this.router.navigate(['/login']).then();
    }

  }
  /**
   * Form Methods
   * initDataForm()
   * onSubmit()
   * isFieldInvalid()
   * checkPasswordStrength()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      // phoneNo: [
      //   '',
      //   [
      //     Validators.required,
      //     phoneNumberValidator(),
      //     Validators.minLength(11),
      //     Validators.maxLength(11)
      //   ]
      // ],
      username: [''],
      password: [''],
    });
  }

  onSubmit() {
    // if (this.dataForm.invalid) {
    //   this.uiService.message('Enter a valid phone number', 'warn');
    //   this.dataForm.markAllAsTouched();
    //   return;
    // }

    if (this.type === 'password-reset' && !this.isOtpValid) {
      if (!this.otpCode) {
        this.isInvalidOtp = true;
      } else {
        this.validateOtpWithUsername();
      }
    } else if (this.type === 'password-reset' && this.isOtpValid) {
      this.resetUserPassword();
    } else {
      this.checkUserWithPhoneNoForResetPassword();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.dataForm.get(field);
    return control.invalid && control.touched;
  }

  checkPasswordStrength() {
    const hasMinLength = this.dataForm.value.password.length >= 6;

    if (hasMinLength) {
      this.passwordStrength = 'strong';
    } else {
      this.passwordStrength = 'weak';
    }
  }


  /**
   * Others
   * onEditPhoneNo()
   * onOtpEnter()
   * togglePasswordVisibility()
   * btnName()
   */
  onEditPhoneNo() {
    this.type = '';
    this.phoneNo = '';
  }

  onOtpEnter(value: string) {
    this.otpCode = value;
    if (this.otpCode) {
      this.validateOtpWithUsername();
    }

  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  get btnName() {
    if (this.type === 'password-reset' && !this.isOtpValid) {
      return 'Verify Code'
    } else if (this.type === 'password-reset' && this.isOtpValid) {
      return 'Change Password'
    } else {
      return 'Sent Otp Code'
    }
  }


  /**
   * HTTP REQ HANDLE
   * checkUserWithPhoneNoForResetPassword()
   * validateOtpWithPhoneNo()
   * userLogin()
   */

  private checkUserWithPhoneNoForResetPassword() {
    this.isLoading = true;
    this.subDataCheck = this.userDataService.checkUserWithPhoneNoForResetPassword({
      username: this.dataForm.value.username,
      // countryCode: this.countryCode
    })
      .subscribe({
        next: res => {
          // console.log('res', res)
          this.isLoading = false;
          if (res.success) {
            this.type = res.data.type;
            this.uiService.message(res.message, 'success')
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err);
          this.isLoading = false;
        }
      })
  }

  private validateOtpWithUsername() {
    this.isLoading = true;
    this.subDataCheck2 = this.otpService.validateOtpWithUsername({
      // phoneNo: this.dataForm.value.phoneNo,
      // countryCode: this.countryCode,
      code: this.otpCode
    })
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.isOtpValid = true;
          } else {
            this.uiService.message(res.message, 'warn');
            this.isOtpValid = false;
          }

        },
        error: err => {
          console.log(err);
          this.isLoading = false;
        }
      })
  }

  private resetUserPassword() {
    this.isLoading = true;
    const data = {
      ...this.dataForm.value,
      // ...{
      //   countryCode: this.countryCode
      // }
    }
    this.subDataReset = this.userDataService.resetUserPassword(data)
      .subscribe({
        next: res => {
          // console.log('res', res)
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, 'success');
            if (this.navigateFrom) {
              this.router.navigate([this.navigateFrom]).then();
            } else {
              this.router.navigate(['/login']).then();
            }
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: err => {
          console.log(err);
          this.isLoading = false;
        }
      })
  }

  storys =[
    {
      images: ['/assets/login/Admin-banner2-01.png']
    },
    {
      images: ['/assets/login/Admin-banner-01.png']
    },
  ]
  /**
   * On Destroy
   */

  ngOnDestroy() {
    this.subDataReset?.unsubscribe();
    this.subDataCheck?.unsubscribe();
    this.subDataCheck2?.unsubscribe();
    this.subRoute?.unsubscribe();
  }


}
