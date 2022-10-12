import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { AppModule } from './app.module';
import { TransactionsService } from './transactions/transactions.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'log'] });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransactionInterceptor(app.get(TransactionsService)),
  );
  await app.listen(3000);
}
bootstrap();
