import { Module } from '@nestjs/common';
import { AffiliateFaqService } from './affiliate-faq.service';
import { AffiliateFaqController } from './affiliate-faq.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AffiliateFaqSchema } from './schema/affiliate-faq.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: 'AffiliateFaq', schema: AffiliateFaqSchema }]),
  ],
  providers: [AffiliateFaqService],
  controllers: [AffiliateFaqController],
})
export class AffiliateFaqModule {}
