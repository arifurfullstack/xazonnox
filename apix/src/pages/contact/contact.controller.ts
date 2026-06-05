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

import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { ContactService } from './contact.service';
import {
  AddContactDto,
  FilterAndPaginationContactDto,
} from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  private logger = new Logger(ContactController.name);

  constructor(private contactService: ContactService) {}

  /**
   * addContact()
   * insertManyContact()
   * getAllContacts()
   * getAllContactsBasic()
   * getContactById()
   * updateContactById()
   * updateMultipleContactById()
   * deleteContactById()
   * deleteMultipleContactById()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addContact(
    @Body()
    addcontactDto: AddContactDto,
  ): Promise<ResponsePayload> {
    return await this.contactService.addContact(addcontactDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllContacts(
    @Body() filterContactDto: FilterAndPaginationContactDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.contactService.getAllContacts(filterContactDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllContactsBasic(): Promise<ResponsePayload> {
    return await this.contactService.getAllContactsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by/:id')
  async getContactById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.contactService.getContactById(id, select);
  }
}
