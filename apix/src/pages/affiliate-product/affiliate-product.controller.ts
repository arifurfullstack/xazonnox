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
import { AffiliateProductService } from './affiliate-product.service';
import {
  AddAffiliateProductDto,
  DeleteAffiliateProductDto,
  FilterAndPaginationAffiliateProductDto,
  GetAffiliateProductByIdsDto,
} from './dto/affiliate-product.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { AffiliateAuthGuard } from 'src/pages/affiliate/guards/affiliate-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('affiliate-product')
export class AffiliateProductController {
  private logger = new Logger(AffiliateProductController.name);

  constructor(private affiliateProductService: AffiliateProductService) {}

  /**
   * Public Api
   * getAllAffiliateProductByShop()
   * getAffiliateProductBySlug()
   * getAffiliateProductByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllAffiliateProductByShop(
    @Body() filterAffiliateProductDto: FilterAndPaginationAffiliateProductDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.getAllAffiliateProductByShop(
      shop,
      filterAffiliateProductDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getAffiliateProductBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.getAffiliateProductBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-affiliateProducts-by-ids')
  async getAffiliateProductByIds(
    @Body() getAffiliateProductByIdsDto: GetAffiliateProductByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.getAffiliateProductByIds(
      shop,
      getAffiliateProductByIdsDto,
      select,
    );
  }

  /**
   * Affiliate Secure Api
   * addAffiliateProduct()
   * deleteMultipleAffiliateProductByIdByAffiliate()
   */

  @Post('/add')
  @UseGuards(AffiliateAuthGuard)
  async addAffiliateProduct(
    @Body()
    addAffiliateProductDto: AddAffiliateProductDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.addAffiliateProduct(
      req.user,
      addAffiliateProductDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleAffiliateProductByIdByAffiliate(
    @Body() deleteAffiliateProductDto: DeleteAffiliateProductDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.deleteMultipleAffiliateProductByIdByAffiliate(
      req.user,
      shop,
      deleteAffiliateProductDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async deleteMultipleTrashAffiliateProduct(
    @Body() deleteAffiliateProductDto: DeleteAffiliateProductDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateProductService.deleteMultipleTrashAffiliateProduct(
      req.user,
      shop,
      deleteAffiliateProductDto.ids,
    );
  }

  /**
   * Admin Secure Api
   * addAffiliateProductByAdmin()
   * getAllAffiliateProducts()
   * getAffiliateProductById()
   * updateAffiliateProductById()
   * updateMultipleAffiliateProductById()
   * deleteMultipleAffiliateProductById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-affiliate')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async getAllAffiliateProductsByAffiliate(
    @Body() filterAffiliateProductDto: FilterAndPaginationAffiliateProductDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.affiliateProductService.getAllAffiliateProducts(
      filterAffiliateProductDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-user')
  // @UsePipes(ValidationPipe)
  async getAllAffiliateProductsByUser(
    @Body() filterAffiliateProductDto: FilterAndPaginationAffiliateProductDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.affiliateProductService.getAllAffiliateProducts(
      filterAffiliateProductDto,
      searchString,
    );
  }
}
