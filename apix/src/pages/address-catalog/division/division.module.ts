import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionController } from './division.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DivisionSchema } from './schema/division.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: 'Division', schema: DivisionSchema }]),
  ],
  providers: [DivisionService],
  controllers: [DivisionController],
})
export class DivisionModule {}
