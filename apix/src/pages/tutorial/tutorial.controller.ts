import {
  Body,
  Controller,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  AddTutorialDto,
  FilterAndPaginationTutorialDto,
} from './dto/tutorial.dto';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { TutorialService } from './tutorial.service';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';

@Controller('tutorial')
export class TutorialController {
  private logger = new Logger(TutorialController.name);

  constructor(private tutorialService: TutorialService) {}

  /**
   * Public Api
   * getAllTutorialByShop()
   * getTutorialBySlug()
   * getTutorialByIds()
   */
  @Post('/get-all-by-shop')
  @UsePipes(ValidationPipe)
  async getAllTutorialByShop(
    @Body() filterTutorialDto: FilterAndPaginationTutorialDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return await this.tutorialService.getAllTutorialByShop(
      shop,
      filterTutorialDto,
      searchString,
    );
  }

  /**
   * addTutorial()
   * insertManyTutorial()
   * getAllTutorials()
   * getTutorialById()
   * updateTutorialById()
   * updateMultipleTutorialById()
   * deleteTutorialById()
   * deleteMultipleTutorialById()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addTutorial(
    @Body()
    addTutorialDto: AddTutorialDto,
  ): Promise<ResponsePayload> {
    return await this.tutorialService.addTutorial(addTutorialDto);
  }
}
