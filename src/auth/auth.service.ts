import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    const isCredentialValid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (user && isCredentialValid) {
      delete user.passwordHash;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const { email, id } = user;
    const payload = { email, sub: id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
