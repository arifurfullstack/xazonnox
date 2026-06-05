import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AffiliateReportSchema } from './schema/affiliate-report.schema';
import { AffiliateReportService } from './affiliate-report.service';
import { AffiliateReportController } from './affiliate-report.controller';
import { CategorySchema } from '../catalog/category/schema/category.schema';
import { BrandSchema } from '../catalog/brand/schema/brand.schema';
import { VendorSchema } from '../vendor/schema/vendor.schema';
import { ShopSchema } from '../shop/schema/shop.schema';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'AffiliateReport', schema: AffiliateReportSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [AffiliateReportService],
  controllers: [AffiliateReportController],
})
export class AffiliateReportModule {}
