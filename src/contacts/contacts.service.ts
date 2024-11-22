import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  async createContact(
    contact: CreateContactDto,
    userEmail: string,
  ): Promise<Contact> {
    const userFound = await this.usersService.findOneByEmail(userEmail);
    if (!userFound) {
      throw new UnauthorizedException();
    }
    const newContact = this.contactRepository.create({
      ...contact,
      user: userFound,
    });

    return await this.contactRepository.save(newContact);
  }

  async createManyContacts(contacts: CreateContactDto[], userEmail: string) {
    const userFound = await this.usersService.findOneByEmail(userEmail);
    if (!userFound) {
      throw new UnauthorizedException();
    }

    const newContacts = contacts.map((contact) =>
     this.contactRepository.create({ ...contact, user: userFound }),
    );
    return await this.contactRepository.save(newContacts);
  }

  async getAllContacts(userId: string ): Promise<Contact[]> {
    const contactsFound = await this.contactRepository.find({
      where: { user: { id: userId } },
    });

    if (contactsFound.length === 0)
      throw new NotFoundException('There are no contacts');

    return contactsFound;
  }
  async getContactById(contactId: string, userId: string): Promise<Contact> {
    const contactFound = await this.contactRepository.findOne(
      {
        where: { id: contactId, user: { id: userId } },
      },
    );
    
    if (!contactFound) {
      throw new NotFoundException(`Contact with id: ${contactId} not found`);
    }
    return contactFound;
  }

  async updateContact(
    contactId: string,
    contact: CreateContactDto,
    userId: string
  ): Promise<Contact> {
    const contactFound = await this.getContactById(contactId, userId);
    const updatedContact = Object.assign(contactFound, contact);
    return await this.contactRepository.save(updatedContact);
  }

  async deleteContact(contactId: string, userId: string): Promise<Contact> {
    const contactFound = await this.getContactById(contactId, userId);
    await this.contactRepository.delete(contactFound);
    return contactFound;
  }
  
  async uploadContactPhoto(contactId: string, file: Buffer, userId: string): Promise<Contact> {
    const contact = await this.getContactById(contactId, userId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (!file) {
      throw new BadRequestException('There is no file');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    contact.photo = uploadResult.secure_url;
    return this.contactRepository.save(contact);
  }

  async getContactPhoto(contactId: string, userId: string): Promise<string> {
    const contact = await this.getContactById(contactId, userId);
    if (!contact || !contact.photo) {
      throw new BadRequestException('The contact does not have a photo');
    }
    return contact.photo;
  }

  async deleteContactPhoto(contactId: string, userId: string): Promise<Contact> {
    const contact = await this.getContactById(contactId, userId);
    if (!contact || !contact.photo) {
      throw new BadRequestException('The contact does not have a photo');
    }

    const publicId = this.extractPublicId(contact.photo);

    const deleteImageResponse =
      await this.cloudinaryService.deleteImage(publicId);
    console.log(deleteImageResponse);
    contact.photo = null;
    return await this.contactRepository.save(contact);
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0];
  }
}
