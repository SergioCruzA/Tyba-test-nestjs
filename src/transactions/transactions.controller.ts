import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /* @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  } */

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Transaction>> {
    limit = limit > 100 ? 100 : limit;
    return this.transactionsService.paginate({
      page,
      limit,
      route: 'http://locahost/transactions',
    });
  }
}
