import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { JwtPayload } from 'src/user/type/user.type';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<JwtPayload> {
    const userDB = await this.userService.getUserByEmail(email);

    if (!userDB) {
      return null;
    }

    if (comparePasswords(pass, userDB.passwordHash)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, createdAt, ...result } = userDB;
      return result;
    }

    return null;
  }

  async login(user: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
