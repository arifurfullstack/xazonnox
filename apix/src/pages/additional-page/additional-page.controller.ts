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
import { AdditionalPageService } from './additional-page.service';
import {
  AddAdditionalPageDto,
  DeleteAdditionalPageDto,
  FilterAndPaginationAdditionalPageDto,
  GetAdditionalPageByIdsDto,
  UpdateAdditionalPageDto,
} from './dto/additional-page.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('additional-page')
export class AdditionalPageController {
  private logger = new Logger(AdditionalPageController.name);

  constructor(private additionalPageService: AdditionalPageService) {}

  /**
   * Public Api
   * getAllAdditionalPageByShop()
   * getAdditionalPageBySlug()
   * getAdditionalPageByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllAdditionalPageByShop(
    @Body() filterAdditionalPageDto: FilterAndPaginationAdditionalPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.getAllAdditionalPageByShop(
      shop,
      filterAdditionalPageDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getAdditionalPageBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.getAdditionalPageBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:slug')
  async getAdditionalPageBySlugs(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.getAdditionalPageBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-additionalPages-by-ids')
  async getAdditionalPageByIds(
    @Body() getAdditionalPageByIdsDto: GetAdditionalPageByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.getAdditionalPageByIds(
      shop,
      getAdditionalPageByIdsDto,
      select,
    );
  }

  /**
   * Vendor Secure Api
   * addAdditionalPage()
   * getAdditionalPageById()
   * updateAdditionalPageById()
   * updateMultipleAdditionalPageById()
   * deleteMultipleAdditionalPageByIdByVendor()
   * deleteMultipleTrashAdditionalPage()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addAdditionalPage(
    @Body()
    addAdditionalPageDto: AddAdditionalPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.addAdditionalPage(
      req.user,
      shop,
      addAdditionalPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug-by-vendor/:slug')
  @UseGuards(VendorAuthGuard)
  async getAdditionalPageById(
    @Param('slug', MongoIdValidationPipe) slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.getAdditionalPageById(
      req.user,
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:slug')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateAdditionalPageById(
    @Param('slug', MongoIdValidationPipe) slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateAdditionalPageDto: UpdateAdditionalPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.updateAdditionalPageById(
      req.user,
      shop,
      slug,
      updateAdditionalPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleAdditionalPageById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateAdditionalPageDto: UpdateAdditionalPageDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.updateMultipleAdditionalPageById(
      req.user,
      shop,
      updateAdditionalPageDto.ids,
      updateAdditionalPageDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleAdditionalPageByIdByVendor(
    @Body() deleteAdditionalPageDto: DeleteAdditionalPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.deleteMultipleAdditionalPageByIdByVendor(
      req.user,
      shop,
      deleteAdditionalPageDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashAdditionalPage(
    @Body() deleteAdditionalPageDto: DeleteAdditionalPageDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.additionalPageService.deleteMultipleTrashAdditionalPage(
      req.user,
      shop,
      deleteAdditionalPageDto.ids,
    );
  }
}
