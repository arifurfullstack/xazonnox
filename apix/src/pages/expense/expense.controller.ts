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
  AddExpenseDto,
  DeleteExpenseDto,
  FilterAndPaginationExpenseDto,
  GetExpenseByIdsDto,
  UpdateExpenseDto,
} from './dto/expense.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  private logger = new Logger(ExpenseController.name);

  constructor(private expenseService: ExpenseService) {}

  /**
   * Public Api
   * getAllExpenseForUi()
   * getAllExpenseByShop()
   * getExpenseBySlug()
   * getExpenseByIds()
   */
  @Get('/get-all-data')
  @UsePipes(ValidationPipe)
  async getAllExpenseForUi(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.expenseService.getAllExpenseForUi(shop);
  }

  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllExpenseByShop(
    @Body() filterExpenseDto: FilterAndPaginationExpenseDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.expenseService.getAllExpenseByShop(
      shop,
      filterExpenseDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-slug/:slug')
  async getExpenseBySlug(
    @Param('slug') slug: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.expenseService.getExpenseBySlug(shop, slug, select);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-expenses-by-ids')
  async getExpenseByIds(
    @Body() getExpenseByIdsDto: GetExpenseByIdsDto,
    @Query('select') select: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.expenseService.getExpenseByIds(
      shop,
      getExpenseByIdsDto,
      select,
    );
  }

  /**
   * Vendor Secure Api
   * addExpense()
   * getExpenseById()
   * updateExpenseById()
   * updateMultipleExpenseById()
   * deleteMultipleExpenseByIdByVendor()
   * deleteMultipleTrashExpense()
   */

  @Post('/add')
  @UseGuards(VendorAuthGuard)
  async addExpense(
    @Body()
    addExpenseDto: AddExpenseDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.addExpense(req.user, shop, addExpenseDto);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by-id/:id')
  @UseGuards(VendorAuthGuard)
  async getExpenseById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('select') select: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.getExpenseById(req.user, shop, id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateExpenseById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.updateExpenseById(
      req.user,
      shop,
      id,
      updateExpenseDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateMultipleExpenseById(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.updateMultipleExpenseById(
      req.user,
      shop,
      updateExpenseDto.ids,
      updateExpenseDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleExpenseByIdByVendor(
    @Body() deleteExpenseDto: DeleteExpenseDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.deleteMultipleExpenseByIdByVendor(
      req.user,
      shop,
      deleteExpenseDto.ids,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-trash')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleTrashExpense(
    @Body() deleteExpenseDto: DeleteExpenseDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.expenseService.deleteMultipleTrashExpense(
      req.user,
      shop,
      deleteExpenseDto.ids,
    );
  }

  /**
   * Admin Secure Api
   * getAllExpenses()
   * deleteMultipleExpenseById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/delete-all-trash-by-shop')
  @UsePipes(ValidationPipe)
  // @UseGuards(AffiliateAuthGuard)
  async deleteAllTrashByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.expenseService.deleteAllTrashByShop(shop);
  }
}
