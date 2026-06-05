import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AffiliateProductSchema } from './schema/affiliate-product.schema';
import { AffiliateProductService } from './affiliate-product.service';
import { AffiliateProductController } from './affiliate-product.controller';
import { CategorySchema } from '../catalog/category/schema/category.schema';
import { BrandSchema } from '../catalog/brand/schema/brand.schema';
import { VendorSchema } from '../vendor/schema/vendor.schema';
import { ShopSchema } from '../shop/schema/shop.schema';

import { AffiliateSchema } from '../affiliate/schema/affiliate.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'AffiliateProduct', schema: AffiliateProductSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Shop', schema: ShopSchema },

      { name: 'Affiliate', schema: AffiliateSchema },
    ]),
  ],
  providers: [AffiliateProductService],
  controllers: [AffiliateProductController],
})
export class AffiliateProductModule {}
