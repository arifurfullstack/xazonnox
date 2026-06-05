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

import {
  AddSupportDto,
  FilterAndPaginationSupportDto,
  UpdateSupportDto,
} from './dto/support.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { SupportService } from './support.service';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { VendorAuthGuard } from '../vendor/guards/vendor-auth.guard';

@Controller('support')
export class SupportController {
  private logger = new Logger(SupportController.name);

  constructor(private supportService: SupportService) {}

  /**
   * Public Api
   * getAllSupportByShop()
   * getSupportBySlug()
   * getSupportByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllSupportByShop(
    @Body() filterSupportDto: FilterAndPaginationSupportDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.supportService.getAllSupportByShop(
      shop,
      filterSupportDto,
      searchString,
    );
  }

  /**
   * addSupport()
   * insertManySupport()
   * getAllSupports()
   * getSupportById()
   * updateSupportById()
   * updateMultipleSupportById()
   * deleteSupportById()
   * deleteMultipleSupportById()
   */
  @Post('/add-by-vendor')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async addSupport(
    @Body()
    addSupportDto: AddSupportDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.supportService.addSupport(req.user, shop, addSupportDto);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  async getSupportById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.supportService.getSupportById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-by-vendor/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateSupportByIdByVendor(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateSupportDto: UpdateSupportDto,
  ): Promise<ResponsePayload> {
    return await this.supportService.updateSupportById(id, updateSupportDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-by-vendor')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleSupportByIdByVendor(
    @Body() data: { ids: string[] },
  ): Promise<ResponsePayload> {
    return await this.supportService.deleteMultipleSupportById(data.ids);
  }
}
