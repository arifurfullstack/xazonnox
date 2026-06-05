import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneSchema } from './schema/zone.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: 'Zone', schema: ZoneSchema }]),
  ],
  providers: [ZoneService],
  controllers: [ZoneController],
})
export class ZoneModule {}
