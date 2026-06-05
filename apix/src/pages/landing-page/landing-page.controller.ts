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
import { LandingPageService } from './landing-page.service';
import {
  AddLandingPageDto,
  DeleteLandingPageDto,
  FilterAndPaginationLandingPageDto,
  GetLandingPageByIdsDto,
  UpdateLandingPageDto,
} from './dto/landing-page.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('landing-page')
export class LandingPageController {
  private logger = new Logger(LandingPageController.name);

  constructor(private landingPageService: LandingPageService) {}

  /**
   * Public Api
   * getAllLandingPageByShop()
   * getLandingPageBySlug()
   * getLandingPageByIds()
   */
  @Get('/get-landing-page')
  @UsePipes(ValidationPipe)
  async getAllCarouselForUi(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.getLandingPageForUi(shop);
  }

  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllLandingPageByShop(
    @Body() filterLandingPageDto: FilterAndPaginationLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.getAllLandingPageByShop(
      shop,
      filterLandingPageDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getLandingPageBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.getLandingPageBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-landingPages-by-ids')
  async getLandingPageByIds(
    @Body() getLandingPageByIdsDto: GetLandingPageByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.getLandingPageByIds(
      shop,
      getLandingPageByIdsDto,
      select,
    );
  }

  /**
   * Vendor Secure Api
   * addLandingPage()
   * getLandingPageById()
   * updateLandingPageById()
   * updateMultipleLandingPageById()
   * deleteMultipleLandingPageByIdByVendor()
   * deleteMultipleTrashLandingPage()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addLandingPage(
    @Body()
    addLandingPageDto: AddLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.addLandingPage(
      req.user,
      shop,
      addLandingPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getLandingPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.getLandingPageById(
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
  async updateLandingPageById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateLandingPageDto: UpdateLandingPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.updateLandingPageById(
      req.user,
      shop,
      id,
      updateLandingPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleLandingPageById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateLandingPageDto: UpdateLandingPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.updateMultipleLandingPageById(
      req.user,
      shop,
      updateLandingPageDto.ids,
      updateLandingPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleLandingPageByIdByVendor(
    @Body() deleteLandingPageDto: DeleteLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.deleteMultipleLandingPageByIdByVendor(
      req.user,
      shop,
      deleteLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-page')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleLandingByIdByVendor(
    @Body() deleteLandingPageDto: DeleteLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.deleteMultiplePageByIdByVendor(
      req.user,
      shop,
      deleteLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashLandingPage(
    @Body() deleteLandingPageDto: DeleteLandingPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.deleteMultipleTrashLandingPage(
      req.user,
      shop,
      deleteLandingPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.landingPageService.deleteAllTrashByShop(shop);
  }
}
