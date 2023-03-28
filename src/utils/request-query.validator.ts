import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class RequestQuery {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number;
}
