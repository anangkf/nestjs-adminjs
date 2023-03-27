import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import hashPassword from 'src/utils/hashPassword';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';

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
  findAll(): Promise<UserModel[]> {
    return this.userService.findAll({});
  }
}
