import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  createContact(
    @Body() contact: CreateContactDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.createContact(contact, reqWithUser.user.email);
  }

  @Post('/createMany')
  createManyContacts(
    @Body() contacts: CreateContactDto[],
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.createManyContacts(
      contacts,
      reqWithUser.user.email,
    );
  }

  @Get()
  getAllContacts(@Req() reqWithUser: RequestWithUser) {
    return this.contactsService.getAllContacts(reqWithUser.user.user_id);
  }

  @Get(':id')
  getContactById(
    @Param('id') contactId: string,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.getContactById(
      contactId,
      reqWithUser.user.user_id,
    );
  }

  @Patch(':id')
  updateContact(
    @Param('id') contactId: string,
    @Body() contact: CreateContactDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.updateContact(
      contactId,
      contact,
      reqWithUser.user.user_id,
    );
  }

  @Delete()
  async deleteAllContacts(@Req() reqWithUser: RequestWithUser): Promise<void> {
    const userId = reqWithUser.user.user_id;
    return this.contactsService.deleteAllContacts(userId);
  }

  @Delete(':id')
  deleteContact(
    @Param('id') contactId: string,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.deleteContact(
      contactId,
      reqWithUser.user.user_id,
    );
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @Param('id') contactId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() reqWithUser: RequestWithUser,
  ) {
    console.log(file.buffer);
    return this.contactsService.uploadContactPhoto(
      contactId,
      file.buffer,
      reqWithUser.user.user_id,
    );
  }

  @Get(':id/photo')
  getPhoto(
    @Param('id') contactId: string,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.getContactPhoto(
      contactId,
      reqWithUser.user.user_id,
    );
  }

  @Delete(':id/photo')
  deletePhoto(
    @Param('id') contactId: string,
    @Req() reqWithUser: RequestWithUser,
  ) {
    return this.contactsService.deleteContactPhoto(
      contactId,
      reqWithUser.user.user_id,
    );
  }
}
