import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorSchema } from './schema/vendor.schema';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { OtpSchema } from '../otp/schema/otp.schema';
import { ShopSchema } from '../shop/schema/shop.schema';
import { SettingSchema } from '../customization/setting/schema/setting.schema';
import { OtpAdminSchema } from '../otp/schema/otp-admin.schema';
import { ShopInformationSchema } from '../customization/shop-information/schema/shop-information.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Shop', schema: ShopSchema },
      { name: 'Otp', schema: OtpSchema },
      { name: 'OtpAdmin', schema: OtpAdminSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'Shop', schema: ShopSchema },
      { name: 'ShopInformation', schema: ShopInformationSchema },
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService, OtpService],
  exports: [],
})
export class VendorModule {}
