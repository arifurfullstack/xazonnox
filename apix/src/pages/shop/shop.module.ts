import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';

import { ShopSchema } from './schema/shop.schema';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { VendorSchema } from '../vendor/schema/vendor.schema';
import { ShopInformationSchema } from '../customization/shop-information/schema/shop-information.schema';
import { SettingSchema } from '../customization/setting/schema/setting.schema';
import { ProductSchema } from '../product/schema/product.schema';
import { CategorySchema } from '../catalog/category/schema/category.schema';
import { SubCategorySchema } from '../catalog/sub-category/schema/sub-category.schema';
import { BrandSchema } from '../catalog/brand/schema/brand.schema';
import { TagSchema } from '../catalog/tag/schema/tag.schema';
import { CarouselSchema } from '../customization/carousel/schema/carousel.schema';
import { HttpModule } from '@nestjs/axios';
import { OtpAdminSchema } from '../otp/schema/otp-admin.schema';
import { OtpSchema } from '../otp/schema/otp.schema';
import { OtpService } from '../otp/otp.service';
import { PreShopSchema } from './schema/pre-shop.schema';
import { AffiliateProductSchema } from '../affiliate-product/schema/affiliate-product.schema';

import { AffiliateSchema } from '../affiliate/schema/affiliate.schema';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: 'PreShop', schema: PreShopSchema },
      { name: 'Shop', schema: ShopSchema },

      { name: 'ShopInformation', schema: ShopInformationSchema },

      { name: 'Vendor', schema: VendorSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'SubCategory', schema: SubCategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Tag', schema: TagSchema },
      { name: 'Carousel', schema: CarouselSchema },

      { name: 'Otp', schema: OtpSchema },
      { name: 'OtpAdmin', schema: OtpAdminSchema },

      { name: 'AffiliateProduct', schema: AffiliateProductSchema },
      { name: 'Affiliate', schema: AffiliateSchema },
    ]),
  ],
  providers: [ShopService, OtpService],
  controllers: [ShopController],
})
export class ShopModule {}
