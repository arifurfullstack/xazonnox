import {
  Body,
  Controller,
  Delete,
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
import { CouponService } from './coupon.service';
import {
  AddCouponDto,
  CheckCouponDto,
  FilterAndPaginationCouponDto,
  OptionCouponDto,
  UpdateCouponDto,
} from './dto/coupon.dto';

import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { UserAuthGuard } from '../../user/guards/user-auth.guard';
import { VendorAuthGuard } from '../../vendor/guards/vendor-auth.guard';

@Controller('coupon')
export class CouponController {
  private logger = new Logger(CouponController.name);

  constructor(private couponService: CouponService) {}

  /**
   * Public Api
   * getAllCouponsByShop()
   * getCouponById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllCouponsByShop(
    @Body() filterCouponDto: FilterAndPaginationCouponDto,
    @Query('q') searchString: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return this.couponService.getAllCouponsByShop(
      shop,
      filterCouponDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-id/:id')
  async getCouponById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.couponService.getCouponById(shop, id, select);
  }

  /**
   * Vendor Secure Api
   * addCoupon()
   * insertManyCoupon()
   * getAllCouponsBasic()
   * getAllCouponsBasic()
   * updateCouponById()
   * updateMultipleCouponById()
   * deleteCouponById()
   * deleteMultipleCouponById()
   */
  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addCoupon(
    @Body()
    addCouponDto: AddCouponDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {

    return await this.couponService.addCoupon(req.user, shop, addCouponDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async insertManyCoupon(
    @Body()
    body: {
      data: AddCouponDto[];
      option: OptionCouponDto;
    },
  ): Promise<ResponsePayload> {
    return await this.couponService.insertManyCoupon(body.data, body.option);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllCouponsBasic(): Promise<ResponsePayload> {
    return await this.couponService.getAllCouponsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateCouponById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateCouponDto: UpdateCouponDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.couponService.updateCouponById(
      req.user,
      shop,
      id,
      updateCouponDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleCouponById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateCouponDto: UpdateCouponDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.couponService.updateMultipleCouponById(
      req.user,
      shop,
      updateCouponDto.ids,
      updateCouponDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteCouponById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.couponService.deleteCouponById(
      req.user,
      shop,
      id,
      Boolean(checkUsage),
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleCouponById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.couponService.deleteMultipleCouponById(
      req.user,
      shop,
      data.ids,
      Boolean(checkUsage),
    );
  }

  /**
   * User Secure Api
   * checkCouponAvailability()
   */

  @Post('/check-coupon-availability')
  @UsePipes(ValidationPipe)

  async checkCouponAvailability(
    @Req() req: any,
    @Body() checkCouponDto: CheckCouponDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.couponService.checkCouponAvailability(
      shop,
      req.user,
      checkCouponDto,
    );
  }
}
