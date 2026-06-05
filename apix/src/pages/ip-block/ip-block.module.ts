import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { IpBlockSchema } from './schema/ip-block.schema';
import { IpBlockService } from './ip-block.service';
import { IpBlockController } from './ip-block.controller';
import { VendorSchema } from 'src/pages/vendor/schema/vendor.schema';
import { ShopSchema } from 'src/pages/shop/schema/shop.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'IpBlock', schema: IpBlockSchema },
      { name: 'Vendor', schema: VendorSchema },
      { name: 'Shop', schema: ShopSchema },
    ]),
  ],
  providers: [IpBlockService],
  controllers: [IpBlockController],
})
export class IpBlockModule {}
