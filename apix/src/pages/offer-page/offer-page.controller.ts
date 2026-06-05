import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { OfferPageService } from './offer-page.service';
import {
  AddOfferPageDto,
  DeleteOfferPageDto,
  FilterAndPaginationOfferPageDto,
  GetOfferPageByIdsDto,
  UpdateOfferPageDto,
} from './dto/offer-page.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('offer-page')
export class OfferPageController {
  private logger = new Logger(OfferPageController.name);

  constructor(private offerPageService: OfferPageService) {}

  /**
   * Public Api
   * getAllOfferPageByShop()
   * getOfferPageBySlug()
   * getOfferPageByIds()
   */
  @Get('/get-offer-page')
  @UsePipes(ValidationPipe)
  async getAllCarouselForUi(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.getOfferPageForUi(shop);
  }

  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllOfferPageByShop(
    @Body() filterOfferPageDto: FilterAndPaginationOfferPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.getAllOfferPageByShop(
      shop,
      filterOfferPageDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getOfferPageBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.getOfferPageBySlug(shop, slug, select);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-offerPages-by-ids')
  async getOfferPageByIds(
    @Body() getOfferPageByIdsDto: GetOfferPageByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.getOfferPageByIds(
      shop,
      getOfferPageByIdsDto,
      select,
    );
  }

  /**
   * Vendor Secure Api
   * addOfferPage()
   * getOfferPageById()
   * updateOfferPageById()
   * updateMultipleOfferPageById()
   * deleteMultipleOfferPageByIdByVendor()
   * deleteMultipleTrashOfferPage()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addOfferPage(
    @Body()
    addOfferPageDto: AddOfferPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.addOfferPage(
      req.user,
      shop,
      addOfferPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getOfferPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.getOfferPageById(
      req.user,
      shop,
      id,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateOfferPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateOfferPageDto: UpdateOfferPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.updateOfferPageById(
      req.user,
      shop,
      id,
      updateOfferPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleOfferPageById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateOfferPageDto: UpdateOfferPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.updateMultipleOfferPageById(
      req.user,
      shop,
      updateOfferPageDto.ids,
      updateOfferPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleOfferPageByIdByVendor(
    @Body() deleteOfferPageDto: DeleteOfferPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.deleteMultipleOfferPageByIdByVendor(
      req.user,
      shop,
      deleteOfferPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashOfferPage(
    @Body() deleteOfferPageDto: DeleteOfferPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.deleteMultipleTrashOfferPage(
      req.user,
      shop,
      deleteOfferPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.offerPageService.deleteAllTrashByShop(shop);
  }


}
