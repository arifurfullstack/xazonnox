import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { LandingPageSchema } from './schema/landing-page.schema';
import { LandingPageService } from './landing-page.service';
import { LandingPageController } from './landing-page.controller';
import { VendorSchema } from 'src/pages/vendor/schema/vendor.schema';
import { ShopSchema } from 'src/pages/shop/schema/shop.schema';
import { ProductSchema } from '../product/schema/product.schema';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'LandingPage', schema: LandingPageSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [LandingPageService],
  controllers: [LandingPageController],
})
export class LandingPageModule {}
