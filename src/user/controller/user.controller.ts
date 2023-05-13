/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { Role } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { UserDto } from '../dto/user.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { date } from 'src/utils/date';
import { encryptPassword } from 'src/utils/bcrypt';

@Controller('users')
@Roles([Role.Superadmin])
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    const result = users.map((item) => {
      const { passwordHash, createdAt, updatedAt, ...result } = item;
      return {
        ...result,
        createdAt: date(createdAt),
        updatedAt: updatedAt ? date(updatedAt) : null,
      };
    });
    return result;
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    const { passwordHash, createdAt, updatedAt, ...result } = user;
    return {
      ...result,
      createdAt: date(createdAt),
      updatedAt: updatedAt ? date(updatedAt) : null,
    };
  }

  @Post('signup')
  async createUser(@Body() createUserDto: UserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Email is already exist');
    }

    const hashedPassword = encryptPassword(password);
    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.deleteUser(id, user);
  }
}
