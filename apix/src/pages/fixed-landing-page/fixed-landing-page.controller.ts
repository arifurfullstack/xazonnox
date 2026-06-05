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
import { FixedLandingPageService } from './fixed-landing-page.service';
import {
  AddFixedLandingPageDto,
  DeleteFixedLandingPageDto,
  FilterAndPaginationFixedLandingPageDto,
  GetFixedLandingPageByIdsDto,
  UpdateFixedLandingPageDto,
} from './dto/fixed-landing-page.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('fixed-landing-page')
export class FixedLandingPageController {
  private logger = new Logger(FixedLandingPageController.name);

  constructor(private fixedLandingPageService: FixedLandingPageService) {}

  /**
   * Public Api
   * getAllFixedLandingPageByShop()
   * getFixedLandingPageBySlug()
   * getFixedLandingPageByIds()
   */
  @Get('/get-landing-page')
  @UsePipes(ValidationPipe)
  async getAllCarouselForUi(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.getFixedLandingPageForUi(shop);
  }

  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllFixedLandingPageByShop(
    @Body() filterFixedLandingPageDto: FilterAndPaginationFixedLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.getAllFixedLandingPageByShop(
      shop,
      filterFixedLandingPageDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getFixedLandingPageBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.getFixedLandingPageBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-fixedLandingPages-by-ids')
  async getFixedLandingPageByIds(
    @Body() getFixedLandingPageByIdsDto: GetFixedLandingPageByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.getFixedLandingPageByIds(
      shop,
      getFixedLandingPageByIdsDto,
      select,
    );
  }

  /**
   * Vendor Secure Api
   * addFixedLandingPage()
   * getFixedLandingPageById()
   * updateFixedLandingPageById()
   * updateMultipleFixedLandingPageById()
   * deleteMultipleFixedLandingPageByIdByVendor()
   * deleteMultipleTrashFixedLandingPage()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addFixedLandingPage(
    @Body()
    addFixedLandingPageDto: AddFixedLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.addFixedLandingPage(
      req.user,
      shop,
      addFixedLandingPageDto,
    );
  }

  @Post('/add-from-gatet')
  @UseGuards(VendorAuthGuard)
  async addFixedLandingPageFromGaget(
    @Body()
    @Query('shop', MongoIdValidationPipe)
    shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.addFixedLandingPageFromGaget(
      req.user,
      shop,
    );
  }


  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getFixedLandingPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.getFixedLandingPageById(
      req.user,
      shop,
      id,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/clone')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async cloneSingleLandingPage(
    @Body('id')
    id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.cloneSingleLandingPage(
      req.user,
      shop,
      id,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateFixedLandingPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateFixedLandingPageDto: UpdateFixedLandingPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.updateFixedLandingPageById(
      req.user,
      shop,
      id,
      updateFixedLandingPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleFixedLandingPageById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateFixedLandingPageDto: UpdateFixedLandingPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.updateMultipleFixedLandingPageById(
      req.user,
      shop,
      updateFixedLandingPageDto.ids,
      updateFixedLandingPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleFixedLandingPageByIdByVendor(
    @Body() deleteFixedLandingPageDto: DeleteFixedLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.deleteMultipleFixedLandingPageByIdByVendor(
      req.user,
      shop,
      deleteFixedLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-page')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleLandingByIdByVendor(
    @Body() deleteFixedLandingPageDto: DeleteFixedLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.deleteMultiplePageByIdByVendor(
      req.user,
      shop,
      deleteFixedLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashFixedLandingPage(
    @Body() deleteFixedLandingPageDto: DeleteFixedLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.deleteMultipleTrashFixedLandingPage(
      req.user,
      shop,
      deleteFixedLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.fixedLandingPageService.deleteAllTrashByShop(shop);
  }

  /**
   * Admin Secure Api
   * getAllFixedLandingPages()
   * deleteMultipleFixedLandingPageById()
   */
}
