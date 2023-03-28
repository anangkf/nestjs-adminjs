import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product as ProductModel } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginateInterceptor } from 'src/interceptors/paginate.interceptor';
import { RequestQuery } from 'src/utils/request-query.validator';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-token')
  create(
    @Req() req: Request,
    @Body(new ValidationPipe()) productData: CreateProductDto,
  ): Promise<ProductModel> {
    const { userId } = req.user;
    const storedProduct = { ...productData, userId };
    return this.productService.create(storedProduct);
  }

  @Get()
  @UseInterceptors(PaginateInterceptor)
  findAll(@Query() query: RequestQuery) {
    const { page = 1, limit = 10 } = query;
    const skip = page > 1 ? (page - 1) * limit : 0;
    return this.productService.findAll({ skip, take: limit });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.findOne({ id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-token')
  async update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const productData = await this.productService.findOne({ id });

    if (req.user.userId === productData.userId) {
      return this.productService.update({
        where: { id },
        data: updateProductDto,
      });
    }
    throw new ForbiddenException('Invalid JWT');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-token')
  async remove(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductModel> {
    const product = await this.productService.findOne({ id });

    if (req.user.userId === product.userId) {
      return this.productService.remove({ id });
    }
    throw new ForbiddenException('Invalid JWT');
  }
}
