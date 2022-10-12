import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '..//common/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSubscriber } from './users.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
