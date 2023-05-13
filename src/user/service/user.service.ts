import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { unixTime } from 'src/utils/date';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<Array<User>> {
    return this.userRepository.find({ where: { isDeleted: false } });
  }

  getUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id, isDeleted: false });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email, isDeleted: false });
  }

  createUser(createUserDto: UserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
      createdAt: unixTime,
    });
    return this.userRepository.save(user);
  }

  createSuperAdminUser(createUserDto: UserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
      role: Role.Superadmin,
      createdAt: unixTime,
    });
    return this.userRepository.save(user);
  }

  async deleteUser(id: number, userDetails: User): Promise<void> {
    await this.userRepository.update(
      { id },
      { ...userDetails, isDeleted: true },
    );
  }
}
