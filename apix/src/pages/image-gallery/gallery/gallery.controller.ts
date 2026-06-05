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
import { GalleryService } from './gallery.service';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';

import { AdminRoles } from '../../../enum/admin-roles.enum';
import {
  AddGalleryDto,
  FilterAndPaginationGalleryDto,
  InsertManyGalleryDto,
  UpdateGalleryDto,
} from './dto/gallery.dto';
import { VendorAuthGuard } from '../../vendor/guards/vendor-auth.guard';

@Controller('gallery')
export class GalleryController {
  private logger = new Logger(GalleryController.name);

  constructor(private galleryService: GalleryService) {}

  /**
   * Admin Secure Api
   * addGallery()
   * insertManyGallery()
   * getAllGallerys()
   * getGalleryById()
   * updateGalleryById()
   * updateMultipleGalleryById()
   * deleteGalleryById()
   * deleteMultipleGalleryById()
   */

  @Post('/insert-many')
  @UsePipes(ValidationPipe)

  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async insertManyGallery(
    @Body()
    body: InsertManyGalleryDto,
  ): Promise<ResponsePayload> {
    return await this.galleryService.insertManyGallery(body.data, body.option);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllGallerys(
    @Body() filterGalleryDto: FilterAndPaginationGalleryDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    filterGalleryDto.filter = {
      ...filterGalleryDto.filter,
      ...{ shop: { $eq: null } },
    };

    return this.galleryService.getAllGallerys(filterGalleryDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by/:id')
  async getGalleryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.galleryService.getGalleryById(id, select);
  }

  /**
   * Vendor Secure Api
   * addGalleryByShop()
   * getAllFolderByShop()
   * updateGalleryByIdByShop()
   * deleteMultipleGalleryByIdByShop()
   */

  @Post('/add-gallery-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async addGalleryByVendor(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() addGalleryDto: AddGalleryDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.galleryService.addGalleryByShop(
      shop,
      req.user,
      addGalleryDto,
    );
  }

  @Post('/insert-many-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async insertManyGalleryByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body()
    body: InsertManyGalleryDto,
  ): Promise<ResponsePayload> {
    return await this.galleryService.insertManyGalleryByShop(shop, body.data);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async getAllFolderByShop(
    @Body() filterGalleryDto: FilterAndPaginationGalleryDto,
    @Query('q') searchString: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.galleryService.getAllFolderByShop(
      shop,
      req.user,
      filterGalleryDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-by-shop/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateGalleryByIdByShop(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.galleryService.updateGalleryByIdByShop(
      req.user,
      shop,
      id,
      updateGalleryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleGalleryByIdByShop(
    @Body() data: { ids: string[] },
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.galleryService.deleteMultipleGalleryByIdByShop(
      req.user,
      shop,
      data.ids,
    );
  }
}
