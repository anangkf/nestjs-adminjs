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
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product as ProductModel } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  findAll() {
    return this.productService.findAll({});
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
