import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponSchema } from './schema/coupon.schema';
import { UserSchema } from '../../user/schema/user.schema';
import {JwtModule} from "@nestjs/jwt";
import { ShopSchema } from '../../shop/schema/shop.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'Coupon', schema: CouponSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
