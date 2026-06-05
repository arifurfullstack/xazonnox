import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema } from './schema/area.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: 'Area', schema: AreaSchema }]),
  ],
  providers: [AreaService],
  controllers: [AreaController],
})
export class AreaModule {}
