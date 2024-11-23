import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ContactRole } from "src/common/enums/contact-role.enum";

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @Transform(({ value }: {value: string}) => value.trim().toLowerCase())
    email?: string;

    @IsNotEmpty()
    @IsString()
    phone!: string;

    @IsOptional()
    @IsString()
    longitude?: string;

    @IsOptional()
    @IsString()
    latitude?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    photo?: string;

    @IsOptional()
    @IsEnum(ContactRole)
    role: ContactRole;
}
