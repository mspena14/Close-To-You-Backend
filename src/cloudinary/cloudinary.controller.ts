import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CloudinaryService } from './cloudinary.service';
  
  @Controller('cloudinary')
  export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {    
      try {
        console.log('llega hasta aquí controller', file);
        
        const uploadResult = await this.cloudinaryService.uploadImage(file.buffer);
        return { url: uploadResult.secure_url };
      } catch (error) {
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
    }
  }
  