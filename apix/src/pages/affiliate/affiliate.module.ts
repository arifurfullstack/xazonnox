import { Module } from '@nestjs/common';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliateSchema } from './schema/affiliate.schema';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { OtpSchema } from '../otp/schema/otp.schema';
import { ShopSchema } from '../shop/schema/shop.schema';
import { SettingSchema } from '../customization/setting/schema/setting.schema';
import { OtpAdminSchema } from '../otp/schema/otp-admin.schema';
import { UniqueUserIdSchema } from '../../schema/unique-user-id.schema';
import { ShopInformationSchema } from '../customization/shop-information/schema/shop-information.schema';
import { AffiliateProductSchema } from '../affiliate-product/schema/affiliate-product.schema';
import { AffiliateConnectionSchema } from './schema/affiliate-connection.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'Affiliate', schema: AffiliateSchema },
      { name: 'Shop', schema: ShopSchema },
      { name: 'Otp', schema: OtpSchema },
      { name: 'OtpAdmin', schema: OtpAdminSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'UniqueUserId', schema: UniqueUserIdSchema },

      { name: 'ShopInformation', schema: ShopInformationSchema },
      { name: 'AffiliateProduct', schema: AffiliateProductSchema },

      { name: 'AffiliateConnection', schema: AffiliateConnectionSchema },
    ]),
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService, OtpService],
  exports: [],
})
export class AffiliateModule {}
