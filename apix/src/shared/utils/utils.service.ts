import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import * as crypto from 'crypto';

@Injectable()
export class UtilsService {
  constructor() {
    // TODO IF NEED
  }

  /**
   * MOMENT DATE FUNCTIONS
   * getDateString
   */
  getDateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  getNextDateString(date: Date, day: number): string {
    return moment(date).add(day, 'days').format('YYYY-MM-DD');
  }

  getLocalDateTime(): Date {
    const newDate = moment().tz('Asia/Dhaka');
    return newDate.toDate();
  }

  getDateYear(date?: any): number {
    let d;
    if (date) {
      d = new Date(date);
    } else {
      d = new Date();
    }
    return d.getFullYear();
  }

  getCurrentTime(): string {
    return moment(new Date()).format('hh:mm a');
  }

  getDateMonth(date?: any, fromZero?: boolean): number {
    let d;
    if (date) {
      d = new Date(date);
    } else {
      d = new Date();
    }
    const month = d.getMonth();
    return fromZero ? month : month + 1;
  }

  getDateWithCurrentTime(date: Date): Date {
    const _ = moment().tz('Asia/Dhaka');
    // const newDate = moment(date).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()});
    const newDate = moment(date).add({ hours: _.hour(), minutes: _.minute() });
    return newDate.toDate();
  }

  addMinuteInCurrentTime(time: number): Date {
    const newDate = moment().tz('Asia/Dhaka').add(time, 'minutes');
    return newDate.toDate();
  }

  getDateDifference(
    date1: Date | string,
    date2: Date | string,
    unit?: string,
  ): number {
    /**
     * If First Date is Current or Future Date
     * If Second Date is Expire or Old Date
     * Return Positive Value If Not Expired
     */
    const a = moment(date1).tz('Asia/Dhaka');
    const b = moment(date2).tz('Asia/Dhaka');

    switch (unit) {
      case 'seconds': {
        return b.diff(a, 'seconds');
      }
      case 'minutes': {
        return b.diff(a, 'minutes');
      }
      case 'hours': {
        return b.diff(a, 'hours');
      }
      case 'days': {
        return b.diff(a, 'days');
      }
      case 'weeks': {
        return b.diff(a, 'weeks');
      }
      default: {
        return b.diff(a, 'hours');
      }
    }
  }

  /**
   * STRING FUNCTIONS
   * transformToSlug
   */
  transformToSlug(value: string, salt?: boolean): string {
    let text = value?.toLowerCase()?.trim();

    // Space to hyphen
    text = text.replace(/\s+/g, '-');

    // Remove any character except Bengali, English, digits, hyphen
    text = text.replace(/[^\u0980-\u09FFa-zA-Z0-9-]/g, '');

    // Remove multiple hyphens
    text = text.replace(/-+/g, '-');
    // Remove trailing hyphen
    text = text.replace(/-+$/, '');
    return salt ? `${text}-${Math.floor(Math.random() * 100000)}` : text;
  }

  public createRegexFromString(inputString: string) {
    // Escape any special characters in the input string
    const escapedString = inputString.replace(
      /[-[\]{}()*+?.,\\^$|/#]/g,
      '\\$&',
    );
    // return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    // Create a regex pattern that matches any symbol, number, and character
    // const regexPattern = `.*[${escapedString}].*`;

    // Create a case-insensitive regex
    return new RegExp(escapedString.trim(), 'i');
  }

  /**
   * RANDOM FUNCTIONS
   * getRandomInt()
   * getRandomString()
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomString(count: number, lastValue: string | number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < count; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return `${result}${lastValue}`;
  }

  /**
   * PAD LEADING
   */
  padLeadingZeros(num): string {
    return String(num).padStart(4, '0');
  }

  /**
   * Ensure 6-character ID with padding
   */
  public padAlphanumeric(str: string): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    while (str.length < 6) {
      str = characters[Math.floor(Math.random() * characters.length)] + str;
    }
    return str;
  }
  /**
   * GENERATE OTP
   * getRandomOtpCode4()
   * getRandomOtpCode6()
   */
  getRandomOtpCode4(): string {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }

  getRandomOtpCode6(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  bytesToKb(bytes: number): number {
    const res = bytes * 0.001;
    return Number(res.toFixed(2));
  }

  /**
   * Calculation
   * getProductPrice()
   * basicPriceCalc()
   */

  getProductPrice(
    product: any,
    type:
      | 'regularPrice'
      | 'salePrice'
      | 'discountAmount'
      | 'discountPercentage',
    variationId?: string,
    quantity?: number,
    isWholesale?: boolean,
  ): number {
    if (product) {
      switch (type) {
        case 'salePrice': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(
              (f) =>
                f._id.toString() ===
                (variationId?.toString() ??
                  product.variationList[0]._id.toString()),
            );
            if (item) {
              if (quantity) {
                return Math.round(
                  ((isWholesale ? item.wholesalePrice : item.salePrice) ?? 0) *
                    quantity,
                );
              }
              return (isWholesale ? item.wholesalePrice : item.salePrice) ?? 0;
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(
                ((isWholesale ? product.wholesalePrice : product.salePrice) ??
                  0) * quantity,
              );
            }
            return (
              (isWholesale ? product.wholesalePrice : product.salePrice) ?? 0
            );
          }
        }

        case 'regularPrice': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(
              (f) =>
                f._id.toString() ===
                (variationId?.toString() ??
                  product.variationList[0]._id.toString()),
            );
            if (item) {
              if (quantity) {
                return Math.round((item.regularPrice ?? 0) * quantity);
              }
              return item.regularPrice ?? 0;
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round((product.regularPrice ?? 0) * quantity);
            }
            return product.regularPrice ?? 0;
          }
        }

        case 'discountAmount': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(
              (f) =>
                f._id.toString() ===
                (variationId?.toString() ??
                  product.variationList[0]._id.toString()),
            );
            if (item) {
              if (quantity) {
                return Math.round(
                  ((item.regularPrice ?? 0) - (item.salePrice ?? 0)) * quantity,
                );
              }
              return (item.regularPrice ?? 0) - (item.salePrice ?? 0);
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(
                ((product.regularPrice ?? 0) -
                  ((isWholesale ? product.wholesalePrice : product.salePrice) ??
                    0)) *
                  quantity,
              );
            }
            return (
              (product.regularPrice ?? 0) -
              ((isWholesale ? product.wholesalePrice : product.salePrice) ?? 0)
            );
          }
        }

        case 'discountPercentage': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(
              (f) =>
                f._id.toString() ===
                (variationId.toString() ??
                  product.variationList[0]._id.toString()),
            );
            if (item) {
              if (quantity) {
                return Math.round(
                  (((item.regularPrice ?? 0) - (item.salePrice ?? 0)) /
                    (item.regularPrice ?? 0)) *
                    100 *
                    quantity,
                );
              }
              return Math.round(
                (((item.regularPrice ?? 0) - (item.salePrice ?? 0)) /
                  (item.regularPrice ?? 0)) *
                  100,
              );
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(
                (((product.regularPrice ?? 0) -
                  ((isWholesale ? product.wholesalePrice : product.salePrice) ??
                    0)) /
                  (product.regularPrice ?? 0)) *
                  100 *
                  quantity,
              );
            }
            return Math.round(
              (((product.regularPrice ?? 0) -
                ((isWholesale ? product.wholesalePrice : product.salePrice) ??
                  0)) /
                (product.regularPrice ?? 0)) *
                100,
            );
          }
        }

        default: {
          return (
            (isWholesale ? product.wholesalePrice : product.salePrice) ?? 0
          );
        }
      }
    } else {
      return 0;
    }
  }

  basicPriceCalc(price: number, discountAmount: number, discountType: string) {
    if (discountType === 'cash') {
      return price - discountAmount;
    } else if (discountType === 'percent') {
      const dis = (discountAmount / 100) * price;
      return price - dis;
    } else {
      return price;
    }
  }

  /**
   * Hash Data
   * SHA256 hashing Format
   * hashDataSha256()
   * formatPhoneNumber()
   */
  hashDataSha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  formatPhoneNumber(phone: string): string {
    // Ensure phone is in E.164 format (e.g., +1234567890)
    return phone.replace(/\D/g, ''); // Remove non-numeric characters
  }

  isSameDay(date: Date) {
    const today = moment().startOf('day').toDate();
    return moment(date).isSame(today, 'day');
  }

  /**
   * Domain Validation
   */

  isValidDomain(domain: string): boolean {
    const allowedTLDs = [
      '.com',
      '.net',
      '.org',
      '.shop',
      '.store',
      '.com.bd',
      '.xyz',
      '.sg',
      '.ae',
      '.me',
      '.in',
      '.eu',
    ];
    domain = domain.trim().toLowerCase();

    if (
      domain.length > 253 || // Max length
      domain.includes(' ') || // No spaces
      domain.includes('/') || // No forward slash
      domain.includes('\\') || // No backslash
      domain.includes('@') || // No email format
      domain.includes('#') ||
      domain.includes('$') ||
      domain.includes('%') ||
      domain.includes('&') ||
      domain.includes('..') || // No double dot
      domain.includes('_') || // No underscore
      /[^\x00-\x7F]/.test(domain) || // No unicode/emoji
      domain.startsWith('.') ||
      domain.endsWith('.') ||
      domain.startsWith('-') ||
      domain.endsWith('-')
    ) {
      return false;
    }

    // Match general domain format
    const domainRegex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z]{2,})+$/;
    if (!domainRegex.test(domain)) return false;

    // Check for allowed TLD
    return allowedTLDs.some((tld) => domain.endsWith(tld));
  }

  isValidFacebookAccessTokenFormat(token: string) {
    if (!token || typeof token !== 'string') return false;

    // Must start with EAA or EAAB/EAAC... (valid Facebook app token prefix)
    const validPrefixes = ['EAA', 'EAAB', 'EAAC', 'EAAD', 'EAAF', 'EAAG'];
    const startsWithValidPrefix = validPrefixes.some((prefix) =>
      token.startsWith(prefix),
    );

    // Check if token is reasonably long (to avoid short or malformed tokens)
    const isLengthValid = token.length >= 100;

    // Check for invalid characters (spaces, control characters)
    const hasInvalidCharacters = /\s/.test(token);

    return startsWithValidPrefix && isLengthValid && !hasInvalidCharacters;
  }


  isValidFacebookPixelId(pixelId: string): boolean {
    if (!pixelId || typeof pixelId !== 'string') return false;

    // Check: Only digits and at least 10-20 characters long
    const pixelIdRegex = /^\d{10,20}$/;

    return pixelIdRegex.test(pixelId);
  }
}
