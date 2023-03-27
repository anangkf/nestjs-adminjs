import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

const hashPassword = (password: string): string => {
  const saltRound = 9;
  return bcrypt.hashSync(password, saltRound, (err, hash: string) => {
    if (err) throw new BadRequestException();
    return hash;
  });
};

export default hashPassword;
