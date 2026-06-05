import {
  Body,
  Controller,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import {
  AddAffiliateFaqDto,
  FilterAndPaginationAffiliateFaqDto,
} from './dto/affiliate-faq.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { AffiliateFaqService } from './affiliate-faq.service';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';

@Controller('affiliate-faq')
export class AffiliateFaqController {
  private logger = new Logger(AffiliateFaqController.name);

  constructor(private affiliateFaqService: AffiliateFaqService) {}

  /**
   * Public Api
   * getAllAffiliateFaqByShop()
   * getAffiliateFaqBySlug()
   * getAffiliateFaqByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllAffiliateFaqByShop(
    @Body() filterAffiliateFaqDto: FilterAndPaginationAffiliateFaqDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateFaqService.getAllAffiliateFaqByShop(
      shop,
      filterAffiliateFaqDto,
      searchString,
    );
  }

  /**
   * addAffiliateFaq()
   * insertManyAffiliateFaq()
   * getAllAffiliateFaqs()
   * getAffiliateFaqById()
   * updateAffiliateFaqById()
   * updateMultipleAffiliateFaqById()
   * deleteAffiliateFaqById()
   * deleteMultipleAffiliateFaqById()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(
  //   AdminRoles.SUPER_ADMIN,
  //   AdminRoles.SUPER_ADMIN,
  //   AdminRoles.EDITOR,
  // )
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async addAffiliateFaq(
    @Body()
    addAffiliateFaqDto: AddAffiliateFaqDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateFaqService.addAffiliateFaq(addAffiliateFaqDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-faq')
  // @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.GET)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async getAllAffiliateFaq(
    @Body() filterAffiliateFaqDto: FilterAndPaginationAffiliateFaqDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.affiliateFaqService.getAllAffiliateFaqs(
      filterAffiliateFaqDto,
      searchString,
    );
  }
}
