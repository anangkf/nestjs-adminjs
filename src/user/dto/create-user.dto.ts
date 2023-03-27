import { ApiProperty } from '@nestjs/swagger';
import { Gender, Product } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  passwordHash: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  verified: boolean;

  // @ApiProperty()
  // @IsOptional()
  // products: Product[];
}
