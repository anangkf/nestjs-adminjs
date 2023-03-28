import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { generatePagination } from 'src/utils/generatePagination';

export interface Response<T> {
  results: T;
  count: number;
}

@Injectable()
export class PaginateInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    nextHandler: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const entity = req.path.replaceAll('/', '');

    const dataLength =
      entity === 'product'
        ? (await this.prisma.product.findMany({})).length
        : (await this.prisma.user.findMany({})).length;

    const { page = 1, limit = 10 } = req.query;

    return nextHandler.handle().pipe(
      map((results) => {
        const { previous, next } = generatePagination({
          page,
          limit,
          dataLength,
          url,
        });
        return {
          count: dataLength,
          page: Number(page),
          previous,
          next,
          results,
        };
      }),
    );
  }
}
