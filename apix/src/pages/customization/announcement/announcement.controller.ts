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
import { AnnouncementService } from './announcement.service';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import { FilterAndPaginationAnnouncementDto } from './dto/announcement.dto';

@Controller('announcement')
export class AnnouncementController {
  private logger = new Logger(AnnouncementController.name);

  constructor(private announcementService: AnnouncementService) {}

  /**
   * Public Api
   * getAllAnnouncements()
   */

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllAnnouncements(
    @Body() filterAnnouncementDto: FilterAndPaginationAnnouncementDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.announcementService.getAllAnnouncements(
      filterAnnouncementDto,
      searchString,
    );
  }

  /**
   * Admin Secure Api
   * addAnnouncement()
   * insertManyAnnouncement()
   * getAllAnnouncementsBasic()
   * getAnnouncementById()
   * updateAnnouncementById()
   * updateMultipleAnnouncementById()
   * deleteAnnouncementById()
   * deleteMultipleAnnouncementById()
   */

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllAnnouncementsBasic(): Promise<ResponsePayload> {
    return await this.announcementService.getAllAnnouncementsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getAnnouncementById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.announcementService.getAnnouncementById(id, select);
  }
}
