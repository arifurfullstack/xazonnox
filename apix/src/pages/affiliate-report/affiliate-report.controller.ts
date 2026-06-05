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
import { AffiliateReportService } from './affiliate-report.service';
import {
  AddAffiliateReportDto,
  DeleteAffiliateReportDto,
  FilterAndPaginationAffiliateReportDto,
  GetAffiliateReportByIdsDto,
} from './dto/affiliate-report.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { AffiliateAuthGuard } from 'src/pages/affiliate/guards/affiliate-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('affiliate-report')
export class AffiliateReportController {
  private logger = new Logger(AffiliateReportController.name);

  constructor(private affiliateReportService: AffiliateReportService) {}

  /**
   * Public Api
   * getAllAffiliateReportByShop()
   * getAffiliateReportBySlug()
   * getAffiliateReportByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllAffiliateReportByShop(
    @Body()
    filterAffiliateReportDto: FilterAndPaginationAffiliateReportDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.getAllAffiliateReportByShop(
      shop,
      filterAffiliateReportDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getAffiliateReportBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.getAffiliateReportBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-affiliateReports-by-ids')
  async getAffiliateReportByIds(
    @Body()
    getAffiliateReportByIdsDto: GetAffiliateReportByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.getAffiliateReportByIds(
      shop,
      getAffiliateReportByIdsDto,
      select,
    );
  }

  /**
   * Affiliate Secure Api
   * addAffiliateReport()
   * deleteMultipleAffiliateReportByIdByAffiliate()
   */

  @Post('/add')
  @UseGuards(AffiliateAuthGuard)
  async addAffiliateReport(
    @Body()
    addAffiliateReportDto: AddAffiliateReportDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.addAffiliateReport(
      req.user,
      addAffiliateReportDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleAffiliateReportByIdByAffiliate(
    @Body() deleteAffiliateReportDto: DeleteAffiliateReportDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.deleteMultipleAffiliateReportByIdByAffiliate(
      req.user,
      shop,
      deleteAffiliateReportDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleTrashAffiliateReport(
    @Body() deleteAffiliateReportDto: DeleteAffiliateReportDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.deleteMultipleTrashAffiliateReport(
      req.user,
      shop,
      deleteAffiliateReportDto.ids,
    );
  }

  /**
   * Admin Secure Api
   * addAffiliateReportByAdmin()
   * getAllAffiliateReports()
   * getAffiliateReportById()
   * updateAffiliateReportById()
   * updateMultipleAffiliateReportById()
   * deleteMultipleAffiliateReportById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN, AdminRoles.EDITOR)
  // @UseGuards(AdminRolesGuard)
  // @UseGuards(AdminAuthGuard)
  async getAllAffiliateReports(
    @Body()
    filterAffiliateReportDto: FilterAndPaginationAffiliateReportDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.affiliateReportService.getAllAffiliateReports(
      filterAffiliateReportDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-affiliate')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async getAllAffiliateReportsByAffiliate(
    @Body()
    filterAffiliateReportDto: FilterAndPaginationAffiliateReportDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.affiliateReportService.getAllAffiliateReports(
      filterAffiliateReportDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-by-affiliate')
  @UsePipes(ValidationPipe)
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleAffiliateReportByIds(
    @Body() data: { ids: string[] },
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.deleteMultipleAffiliateReportById(
      data.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-by-affiliate-payment-report')
  @UsePipes(ValidationPipe)
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleAffiliatePaymentReportById(
    @Body() data: { ids: string[] },
  ): Promise<ResponsePayload> {
    return await this.affiliateReportService.deleteMultipleAffiliatePaymentReportById(
      data.ids,
    );
  }
}
