import { IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  price: number;
}
