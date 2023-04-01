import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import hashPassword from '../utils/hashPassword';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { PaginateInterceptor } from '../interceptors/paginate.interceptor';
import { RequestQuery } from '../utils/request-query.validator';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  create(
    @Body() { email, password, name, gender, verified }: CreateUserDto,
  ): Promise<UserModel> {
    const passwordHash = hashPassword(password);
    return this.userService.create({
      email,
      passwordHash,
      name,
      gender,
      verified,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Body() {}: LoginDto) {
    return this.authService.login(req.user);
  }

  @Get()
  @UseInterceptors(PaginateInterceptor)
  findAll(@Query() query: RequestQuery): Promise<UserModel[]> {
    const { page = 1, limit = 10 } = query;
    const skip = page > 1 ? (page - 1) * limit : 0;
    return this.userService.findAll({ skip, take: limit });
  }
}
