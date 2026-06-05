import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../user/schema/user.schema';

import { OrderSchema } from '../order/schema/order.schema';
import { ProductSchema } from '../product/schema/product.schema';
import { ShopSchema } from '../shop/schema/shop.schema';
import { CategorySchema } from '../catalog/category/schema/category.schema';

import { AffiliateProductSchema } from '../affiliate-product/schema/affiliate-product.schema';
import { AffiliateSchema } from '../affiliate/schema/affiliate.schema';
import { AffiliateConnectionSchema } from '../affiliate/schema/affiliate-connection.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },

      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Shop', schema: ShopSchema },
      { name: 'Category', schema: CategorySchema },

      { name: 'AffiliateProduct', schema: AffiliateProductSchema },
      { name: 'Affiliate', schema: AffiliateSchema },
      { name: 'AffiliateConnection', schema: AffiliateConnectionSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
