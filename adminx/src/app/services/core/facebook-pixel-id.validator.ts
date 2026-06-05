import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const facebookPixelIdValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pixelId = control.value?.trim();

  if (!pixelId || typeof pixelId !== 'string') {
    return { invalidPixelId: true };
  }

  // Must be 10-20 digit-only numbers
  const pixelIdPattern = /^\d{10,20}$/;

  if (!pixelIdPattern.test(pixelId)) {
    return { invalidPixelId: true };
  }

  return null;
};
