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
import { ChildCategoryService } from './child-category.service';
import {
  AddChildCategoryDto,
  DeleteChildCategoryDto,
  FilterAndPaginationChildCategoryDto,
  GetChildCategoryByIdsDto,
  UpdateChildCategoryDto,
} from './dto/child-category.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';

@Controller('child-category')
export class ChildCategoryController {
  private logger = new Logger(ChildCategoryController.name);

  constructor(private childCategoryService: ChildCategoryService) {}

  /**
   * Public Api
   * getAllChildCategoryByShop()
   * getChildCategoryBySlug()
   * getChildCategoryByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllChildCategoryByShop(
    @Body() filterChildCategoryDto: FilterAndPaginationChildCategoryDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getAllChildCategoryByShop(
      shop,
      filterChildCategoryDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-by-parent/:id')
  async getSubCategoriesByCategoryId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getSubCategoriesByCategoryId(
      id,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getChildCategoryBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getChildCategoryBySlug(
      shop,
      slug,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-childCategorys-by-ids')
  async getChildCategoryByIds(
    @Body() getChildCategoryByIdsDto: GetChildCategoryByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getChildCategoryByIds(
      shop,
      getChildCategoryByIdsDto,
      select,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-child-categories-group-by-category')
  @Version(VERSION_NEUTRAL)
  @UsePipes(ValidationPipe)
  async getChildCategoriesGroupByCategory(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return this.childCategoryService.getSubCategoriesGroupByCategory(shop);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-subcategories-group-by-category')
  @UsePipes(ValidationPipe)
  async getSubCategoriesGroupByCategory(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return this.childCategoryService.getChildCategoriesGroupByCategory(shop);
  }

  /**
   * Vendor Secure Api
   * addChildCategory()
   * getChildCategoryById()
   * updateChildCategoryById()
   * updateMultipleChildCategoryById()
   * deleteMultipleChildCategoryByIdByVendor()
   * deleteMultipleTrashChildCategory()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addChildCategory(
    @Body()
    addChildCategoryDto: AddChildCategoryDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.addChildCategory(
      req.user,
      shop,
      addChildCategoryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getChildCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getChildCategoryById(
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
  async updateChildCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateChildCategoryDto: UpdateChildCategoryDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.updateChildCategoryById(
      req.user,
      shop,
      id,
      updateChildCategoryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleChildCategoryById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateChildCategoryDto: UpdateChildCategoryDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.updateMultipleChildCategoryById(
      req.user,
      shop,
      updateChildCategoryDto.ids,
      updateChildCategoryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleChildCategoryByIdByVendor(
    @Body() deleteChildCategoryDto: DeleteChildCategoryDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.deleteMultipleChildCategoryByIdByVendor(
      req.user,
      shop,
      deleteChildCategoryDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashChildCategory(
    @Body() deleteChildCategoryDto: DeleteChildCategoryDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.deleteMultipleTrashChildCategory(
      req.user,
      shop,
      deleteChildCategoryDto.ids,
    );
  }

  /**
   * Admin Secure Api
   * getAllChildCategorys()
   * deleteMultipleChildCategoryById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.deleteAllTrashByShop(shop);
  }
}
