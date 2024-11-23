import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: Buffer, folder: string = 'contacts'): Promise<UploadApiResponse> {
    console.log('Iniciando subida de imagen...');
    console.log('Buffer recibido:', file);

    if (!file) {
      console.error('Buffer está vacío.');
      throw new BadRequestException('No file uploaded');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            console.error('Error al subir a Cloudinary:', error);
            return reject(error);
          }
          console.log('Subida exitosa a Cloudinary:', result);
          resolve(result);
        },
      );
      try {
        streamifier.createReadStream(file).pipe(uploadStream);
      } catch (streamError) {
        console.error('Error en el stream hacia Cloudinary:', streamError);
        reject(streamError);
      }
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      return await this.cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar la imagen en Cloudinary:', error);
      throw new BadRequestException('Error eliminando imagen');
    }
  }
}

