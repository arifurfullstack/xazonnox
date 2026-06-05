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
import { FileFolderService } from './file-folder.service';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import {
  AddFileFolderDto,
  FilterAndPaginationFileFolderDto,
  UpdateFileFolderDto,
} from './dto/file-folder.dto';
import { VendorAuthGuard } from '../../vendor/guards/vendor-auth.guard';

@Controller('file-folder')
export class FileFolderController {
  private logger = new Logger(FileFolderController.name);

  constructor(private fileFolderService: FileFolderService) {}

  /**
   * Admin Secure Api
   * addFileFolder()
   * insertManyFileFolder()
   * getAllFileFolders()
   * getFileFolderById()
   * updateFileFolderById()
   * updateMultipleFileFolderById()
   * deleteFileFolderById()
   * deleteMultipleFileFolderById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllFileFolders(
    @Body() filterFileFolderDto: FilterAndPaginationFileFolderDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    filterFileFolderDto.filter = {
      ...filterFileFolderDto.filter,
      ...{ shop: { $eq: null } },
    };

    return this.fileFolderService.getAllFileFolders(
      filterFileFolderDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by/:id')
  async getFileFolderById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.fileFolderService.getFileFolderById(id, select);
  }

  /**
   * Vendor Secure Api
   * addFileFolderByShop()
   * getAllFolderByShop()
   * updateFileFolderByIdByShop()
   * deleteMultipleFileFolderByIdByShop()
   */

  @Post('/add-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async addFileFolderByVendor(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() addFileFolderDto: AddFileFolderDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fileFolderService.addFileFolderByShop(
      shop,
      req.user,
      addFileFolderDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async getAllFolderByShop(
    @Body() filterFileFolderDto: FilterAndPaginationFileFolderDto,
    @Query('q') searchString: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fileFolderService.getAllFolderByShop(
      shop,
      req.user,
      filterFileFolderDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-by-shop/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateFileFolderByIdByShop(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateFileFolderDto: UpdateFileFolderDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fileFolderService.updateFileFolderByIdByShop(
      req.user,
      shop,
      id,
      updateFileFolderDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleFileFolderByIdByShop(
    @Body() data: { ids: string[] },
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.fileFolderService.deleteMultipleFileFolderByIdByShop(
      req.user,
      shop,
      data.ids,
    );
  }
}
