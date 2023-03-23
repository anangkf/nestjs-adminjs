import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string | 'male' | 'female';

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  verified: boolean;

  @ApiProperty()
  @IsOptional()
  products: Product[];
}
