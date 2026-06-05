import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'productPrice',
  standalone: true
})
export class ProductPricePipe implements PipeTransform {

  transform(product: any, type: 'regularPrice' | 'salePrice' | 'discountAmount' | 'discountPercentage', variationId?: string, quantity?: number): number {
    if (product) {
      switch (type) {
        case 'salePrice': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(f => f._id === (variationId ?? product.variationList[0]._id));
            if (item) {
              if (quantity) {
                return Math.round((item.salePrice ?? 0) * quantity);
              }
              return item.salePrice ?? 0;
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round((product.salePrice ?? 0) * quantity);
            }
            return product.salePrice ?? 0;
          }
        }

        case 'regularPrice': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(f => f._id === (variationId ?? product.variationList[0]._id));
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
              return Math.round((product.regularPrice ?? 0)* quantity);
            }
            return product.regularPrice ?? 0;
          }
        }

        case 'discountAmount': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(f => f._id === (variationId ?? product.variationList[0]._id));
            if (item) {
              if (quantity) {
                return Math.round(((item.regularPrice ?? 0) - (item.salePrice ?? 0)) * quantity);
              }
              return (item.regularPrice ?? 0) - (item.salePrice ?? 0);
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(((product.regularPrice ?? 0) - (product.salePrice ?? 0)) * quantity);
            }
            return (product.regularPrice ?? 0) - (product.salePrice ?? 0);
          }
        }

        case 'discountPercentage': {
          if (product.isVariation && product.variationList.length) {
            const item = product.variationList.find(f => f._id === (variationId ?? product.variationList[0]._id));
            if (item) {
              if (quantity) {
                return Math.round(((((item.regularPrice ?? 0) - (item.salePrice ?? 0)) / (item.regularPrice ?? 0)) * 100) * quantity);
              }
              return Math.round((((item.regularPrice ?? 0) - (item.salePrice ?? 0)) / (item.regularPrice ?? 0)) * 100)
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(((((product.regularPrice ?? 0) - (product.salePrice ?? 0)) / (product.regularPrice ?? 0)) * 100) * quantity);
            }
            return Math.round((((product.regularPrice ?? 0) - (product.salePrice ?? 0)) / (product.regularPrice ?? 0)) * 100);

          }
        }

        default: {
          return product?.salePrice ?? 0;
        }
      }
    } else {
      return 0;
    }
  }

}
