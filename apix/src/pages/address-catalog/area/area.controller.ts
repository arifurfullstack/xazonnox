import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { FilterAndPaginationAreaDto } from './dto/area.dto';
import { AreaService } from './area.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';

@Controller('area')
export class AreaController {
  private logger = new Logger(AreaController.name);

  constructor(private areaService: AreaService) {}

  /**
   * Area Service Methods
   * addArea() -> /add
   * insertManyArea() -> /insert-many
   * getAllAreas() -> /get-all
   * getAreaByParentId() -> /get-all-by-parent/:id
   * getAreaById() -> /:id
   * updateAreaById() -> /update/:id
   * updateMultipleAreaById() -> /update-multiple
   * deleteAreaById() -> /delete/:id
   * deleteMultipleAreaById() -> /delete-multiple
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllAreas(
    @Body() filterAreaDto: FilterAndPaginationAreaDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.areaService.getAllAreas(filterAreaDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-by-parent/:id')
  async getAreaByParentId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.areaService.getAreaByParentId(id, select);
  }
}
