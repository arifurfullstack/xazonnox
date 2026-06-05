import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { PaymentLinkService } from './payment-link.service';
import {
  AddPaymentLinkDto,
  DeletePaymentLinkDto,
  FilterAndPaginationPaymentLinkDto,
  GetPaymentLinkByIdsDto,
} from './dto/payment-link.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { AffiliateAuthGuard } from 'src/pages/affiliate/guards/affiliate-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('payment-link')
export class PaymentLinkController {
  private logger = new Logger(PaymentLinkController.name);

  constructor(private paymentLinkService: PaymentLinkService) {}

  /**
   * Public Api
   * getAllPaymentLinkByShop()
   * getPaymentLinkBySlug()
   * getPaymentLinkByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllPaymentLinkByShop(
    @Body() filterPaymentLinkDto: FilterAndPaginationPaymentLinkDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.getAllPaymentLinkByShop(
      shop,
      filterPaymentLinkDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getPaymentLinkBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.getPaymentLinkBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-paymentLinks-by-ids')
  async getPaymentLinkByIds(
    @Body() getPaymentLinkByIdsDto: GetPaymentLinkByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.getPaymentLinkByIds(
      shop,
      getPaymentLinkByIdsDto,
      select,
    );
  }

  /**
   * Affiliate Secure Api
   * addPaymentLink()
   * deleteMultiplePaymentLinkByIdByAffiliate()
   */

  @Post('/add')
  @UseGuards(AffiliateAuthGuard)
  async addPaymentLink(
    @Body()
    addPaymentLinkDto: AddPaymentLinkDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.addPaymentLink(
      req.user,
      addPaymentLinkDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultiplePaymentLinkByIdByAffiliate(
    @Body() deletePaymentLinkDto: DeletePaymentLinkDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.deleteMultiplePaymentLinkByIdByAffiliate(
      req.user,
      shop,
      deletePaymentLinkDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleTrashPaymentLink(
    @Body() deletePaymentLinkDto: DeletePaymentLinkDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.paymentLinkService.deleteMultipleTrashPaymentLink(
      req.user,
      shop,
      deletePaymentLinkDto.ids,
    );
  }

  /**
   * Admin Secure Api
   * addPaymentLinkByAdmin()
   * getAllPaymentLinks()
   * getPaymentLinkById()
   * updatePaymentLinkById()
   * updateMultiplePaymentLinkById()
   * deleteMultiplePaymentLinkById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-affiliate')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async getAllPaymentLinksByAffiliate(
    @Body() filterPaymentLinkDto: FilterAndPaginationPaymentLinkDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.paymentLinkService.getAllPaymentLinks(
      filterPaymentLinkDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-user')
  // @UsePipes(ValidationPipe)
  async getAllPaymentLinksByUser(
    @Body() filterPaymentLinkDto: FilterAndPaginationPaymentLinkDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.paymentLinkService.getAllPaymentLinks(
      filterPaymentLinkDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  async getPaymentLinkById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    console.log('d');
    return await this.paymentLinkService.getPaymentLinkById(
      req.user,
      id,
      select,
    );
  }
}
