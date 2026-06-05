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
import { FilterAndPaginationZoneDto } from './dto/zone.dto';
import { ZoneService } from './zone.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';

@Controller('zone')
export class ZoneController {
  private logger = new Logger(ZoneController.name);

  constructor(private zoneService: ZoneService) {}

  /**
   * Zone Service Methods
   * addZone() -> /add
   * insertManyZone() -> /insert-many
   * getAllZones() -> /get-all
   * getZoneByParentId() -> /get-all-by-parent/:id
   * getZoneById() -> /:id
   * updateZoneById() -> /update/:id
   * updateMultipleZoneById() -> /update-multiple
   * deleteZoneById() -> /delete/:id
   * deleteMultipleZoneById() -> /delete-multiple
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllZones(
    @Body() filterZoneDto: FilterAndPaginationZoneDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.zoneService.getAllZones(filterZoneDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-by-parent/:id')
  async getZoneByParentId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.zoneService.getZoneByParentId(id, select);
  }
}
