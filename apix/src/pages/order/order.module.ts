import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { JwtModule } from '@nestjs/jwt';
import { UniqueIdSchema } from '../../schema/unique-id.schema';
import { ProductSchema } from '../product/schema/product.schema';
import { CartSchema } from '../cart/schema/cart.schema';
import { UserSchema } from '../user/schema/user.schema';
import { ShopSchema } from '../shop/schema/shop.schema';
import { NotificationModule } from '../notification/notification.module';
import { LogReportSchema } from '../../shared/log-report/schema/log-report.schema';
import { SettingSchema } from '../customization/setting/schema/setting.schema';
import { ShopInformationSchema } from '../customization/shop-information/schema/shop-information.schema';
import { CouponSchema } from '../offers/coupon/schema/coupon.schema';
import { Vendor } from '../vendor/interfaces/vendor.interface';
import { VendorSchema } from '../vendor/schema/vendor.schema';
import { IncompleteOrderSchema } from './schema/incomplete-order.schema';
import { HttpModule } from '@nestjs/axios';
import { AffiliateProductSchema } from '../affiliate-product/schema/affiliate-product.schema';
import { AffiliateReportSchema } from '../affiliate-report/schema/affiliate-report.schema';
import { IpBlockSchema } from '../ip-block/schema/ip-block.schema';

@Module({
  imports: [
    JwtModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'UniqueId', schema: UniqueIdSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Shop', schema: ShopSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'LogReport', schema: LogReportSchema },
      { name: 'ShopInformation', schema: ShopInformationSchema },
      { name: 'Coupon', schema: CouponSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'IncompleteOrder', schema: IncompleteOrderSchema },
      { name: 'AffiliateProduct', schema: AffiliateProductSchema },
      { name: 'AffiliateReport', schema: AffiliateReportSchema },
      { name: 'IpBlock', schema: IpBlockSchema },
    ]),
    NotificationModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
