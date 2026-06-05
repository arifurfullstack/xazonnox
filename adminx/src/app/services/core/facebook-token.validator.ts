import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const facebookAccessTokenValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const token = control.value?.trim();

  if (!token || typeof token !== 'string') {
    return { invalidToken: true };
  }

  // Valid Facebook Access Token prefixes
  const validPrefixes = ['EAA', 'EAAB', 'EAAC', 'EAAD', 'EAAF', 'EAAG'];

  const startsWithValidPrefix = validPrefixes.some((prefix) =>
    token.startsWith(prefix)
  );

  const isLengthValid = token.length >= 100;
  const hasInvalidCharacters = /\s/.test(token); // no spaces allowed
  const endsWithZDZD = token.endsWith('ZDZD');

  if (!startsWithValidPrefix || !isLengthValid || hasInvalidCharacters || !endsWithZDZD) {
    return { invalidToken: true };
  }

  return null;
};
