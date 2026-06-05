import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { VendorAuthGuard } from '../vendor/guards/vendor-auth.guard';
import { FilterAndPaginationOrderDto } from '../order/dto/order.dto';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';

@Controller('dashboard')
export class DashboardController {
  private logger = new Logger(DashboardController.name);

  constructor(private dashboardService: DashboardService) {}

  /**
   * getAdminDashboard()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-order-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async getAllOrderByShop(
    @Body() filterOrderDto: FilterAndPaginationOrderDto,
    @Query('q') searchString: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.dashboardService.getAllOrderByShop(
      req.user,
      shop,
      filterOrderDto,
      searchString,
    );
  }

  /**
   * getDashboardForAffiliate()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-affiliate')
  async getAllAffiliate(
    @Body() filterDto: any,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.dashboardService.getAllAffiliate(filterDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-affiliate-info-for-owner')
  async getAllAffiliateInfoForOwner(
    @Body() filterDto: any,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.dashboardService.getAllAffiliateInfoForOwner(
      filterDto,
      searchString,
    );
  }

  /**
   * getAdminDashboard()
   */

  @Version(VERSION_NEUTRAL)
  @Get('/dashboard-product-count-by-vendor')
  @UseGuards(VendorAuthGuard)
  @UseGuards(VendorAuthGuard)
  async getDashboardProductCountByVendor(
    @Req() req: any,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.dashboardService.getVendorDashboard(shop);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/dashboard-category-by-product')
  @UseGuards(VendorAuthGuard)
  @UseGuards(VendorAuthGuard)
  async getDashboardCategoryByProduct(
    @Req() req: any,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.dashboardService.getDashboardCategoryByProduct(
      req.user,
      shop,
    );
  }

  @Get('/dashboard-graph-by-shop')
  async getSalesData(
    @Query('period') period: string,
    @Query('shop') shop: string,
  ) {
    return this.dashboardService.getSalesData(period, shop);
  }

  @Get('/dashboard-graph-by-affiliate')
  async getAffiliateData(
    @Query('period') period: string,
    @Query('affiliateId') affiliateId: string,
  ) {
    return this.dashboardService.getAffiliateData(period, affiliateId);
  }
}
