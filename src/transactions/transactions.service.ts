import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Transaction } from '../common/typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(newTransaction);
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Transaction>> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('t');

    queryBuilder.leftJoinAndSelect('t.user', 'user');
    queryBuilder.orderBy('t.createdAt', 'DESC');
    queryBuilder.select(['t', 'user.id', 'user.username']);

    return paginate<Transaction>(queryBuilder, options);
  }
}
