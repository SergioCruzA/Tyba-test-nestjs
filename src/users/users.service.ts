import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/typeorm';

import { CreateUserDto } from './dto/user.dto';
import { USER_ALREADY_EXISTS } from '../common/constants/error.messages';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('Creating an user');
    const user = await this.findOne(createUserDto.username);
    if (user) throw new BadRequestException(USER_ALREADY_EXISTS);
    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    this.logger.log(`Finding an user with username: ${username}`);
    return this.userRepository.findOneBy({ username });
  }
}
