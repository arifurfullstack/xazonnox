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
import { IpBlockService } from './ip-block.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import {
  AddIpBlockDto,
  DeleteIpBlockDto,
  FilterAndPaginationIpBlockDto,
  GetIpBlockByIdsDto,
  UpdateIpBlockDto,
} from './dto/ip-block.dto';

@Controller('IpBlock')
export class IpBlockController {
  private logger = new Logger(IpBlockController.name);

  constructor(private IpBlockService: IpBlockService) {}

  /**
   * Public Api
   * getAllIpBlockByShop()
   * getIpBlockBySlug()
   * getIpBlockByIds()
   */

  @Get('/get-all-data')
  @UsePipes(ValidationPipe)
  async getAllIpBlockForUi(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.getAllIpBlockForUi(shop);
  }

  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllIpBlockByShop(
    @Body() filterIpBlockDto: FilterAndPaginationIpBlockDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.getAllIpBlockByShop(
      shop,
      filterIpBlockDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getIpBlockBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.getIpBlockBySlug(shop, slug, select);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-IpBlocks-by-ids')
  async getIpBlockByIds(
    @Body() getIpBlockByIdsDto: GetIpBlockByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.getIpBlockByIds(
      shop,
      getIpBlockByIdsDto,
      select,
    );
  }

  // @Get('blocked')
  // async getBlockedIps() {
  //   return this.IpBlockService.getBlockedIps();
  // }
  //
  // @Post('block')
  // async blockIp(@Body('ip') ip: string) {
  //   await this.IpBlockService.blockIpManually(ip);
  //   return { message: 'IP blocked manually' };
  // }
  //
  // @Post('unblock')
  // async unblockIp(@Body('ip') ip: string) {
  //   await this.IpBlockService.unblockIp(ip);
  //   return { message: 'IP unblocked' };
  // }

  /**
   * Vendor Secure Api
   * addIpBlock()
   * getIpBlockById()
   * updateIpBlockById()
   * updateMultipleIpBlockById()
   * deleteMultipleIpBlockByIdByVendor()
   * deleteMultipleTrashIpBlock()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addIpBlock(
    @Body()
    addIpBlockDto: AddIpBlockDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.addIpBlock(req.user, shop, addIpBlockDto);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getIpBlockById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.getIpBlockById(req.user, shop, id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateIpBlockById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateIpBlockDto: UpdateIpBlockDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.updateIpBlockById(
      req.user,
      shop,
      id,
      updateIpBlockDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleIpBlockById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateIpBlockDto: UpdateIpBlockDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.updateMultipleIpBlockById(
      req.user,
      shop,
      updateIpBlockDto.ids,
      updateIpBlockDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleIpBlockByIdByVendor(
    @Body() deleteIpBlockDto: DeleteIpBlockDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.deleteMultipleIpBlockByIdByVendor(
      req.user,
      shop,
      deleteIpBlockDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashIpBlock(
    @Body() deleteIpBlockDto: DeleteIpBlockDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.deleteMultipleTrashIpBlock(
      req.user,
      shop,
      deleteIpBlockDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.IpBlockService.deleteAllTrashByShop(shop);
  }
}
