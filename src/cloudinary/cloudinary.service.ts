import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: Buffer, folder: string = 'contacts'): Promise<UploadApiResponse> {
    console.log('llega hasta aquí service', file);

    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return await this.cloudinary.uploader.destroy(publicId);
  }
}
