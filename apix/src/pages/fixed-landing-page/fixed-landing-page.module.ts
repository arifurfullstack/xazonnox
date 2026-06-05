import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { FixedLandingPageSchema } from './schema/fixed-landing-page.schema';
import { FixedLandingPageService } from './fixed-landing-page.service';
import { VendorSchema } from 'src/pages/vendor/schema/vendor.schema';
import { ShopSchema } from 'src/pages/shop/schema/shop.schema';
import { ProductSchema } from '../product/schema/product.schema';
import { FixedLandingPageController } from './fixed-landing-page.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: 'FixedLandingPage', schema: FixedLandingPageSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [FixedLandingPageService],
  controllers: [FixedLandingPageController],
})
export class FixedLandingPageModule {}
