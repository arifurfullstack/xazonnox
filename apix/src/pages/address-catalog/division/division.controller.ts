import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { DivisionService } from './division.service';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import {
  AddDivisionDto,
  FilterAndPaginationDivisionDto,
  UpdateDivisionDto,
} from './dto/division.dto';
import { VendorAuthGuard } from 'src/pages/vendor/guards/vendor-auth.guard';

@Controller('division')
export class DivisionController {
  private logger = new Logger(DivisionController.name);

  constructor(private divisionService: DivisionService) {}

  /**
   * addDivision()
   * insertManyDivision()
   * getAllDivisions()
   * getAllDivisionsBasic()
   * getDivisionById()
   * updateDivisionById()
   * updateMultipleDivisionById()
   * deleteDivisionById()
   * deleteMultipleDivisionById()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllDivisions(
    @Body() filterDivisionDto: FilterAndPaginationDivisionDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.divisionService.getAllDivisions(
      filterDivisionDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllDivisionsBasic(): Promise<ResponsePayload> {
    return await this.divisionService.getAllDivisionsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by/:id')
  async getDivisionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.divisionService.getDivisionById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getDivisionBySingleId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.divisionService.getDivisionBySingleId(id, select);
  }

  @Post('/add')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async addDivision(
    @Body()
    addDivisionDto: AddDivisionDto,
  ): Promise<ResponsePayload> {
    return await this.divisionService.addDivision(addDivisionDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async deleteMultipleDivisionById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.divisionService.deleteMultipleDivisionById(
      data.ids,
      Boolean(checkUsage),
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateDivisionById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ): Promise<ResponsePayload> {
    return await this.divisionService.updateDivisionById(id, updateDivisionDto);
  }
}
