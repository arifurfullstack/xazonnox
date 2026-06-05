import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { OfferPageSchema } from './schema/offer-page.schema';
import { OfferPageService } from './offer-page.service';
import { OfferPageController } from './offer-page.controller';
import { VendorSchema } from 'src/pages/vendor/schema/vendor.schema';
import { ShopSchema } from 'src/pages/shop/schema/shop.schema';
import { ProductSchema } from '../product/schema/product.schema';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'OfferPage', schema: OfferPageSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [OfferPageService],
  controllers: [OfferPageController],
})
export class OfferPageModule {}
