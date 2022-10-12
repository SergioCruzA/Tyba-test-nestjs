import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionsService } from '../../transactions/transactions.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionInterceptor.name);
  constructor(private readonly transactionService: TransactionsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const {
      originalUrl,
      route: { path },
      user,
    } = request;

    let action;
    if (path && path.includes('/users/create')) action = 'register';
    if (path && path.includes('/auth/login')) action = 'login';
    if (path && path.includes('/restaurants')) action = 'getRestaurants';
    if (path && path.includes('/transactions')) action = 'getTransactions';

    return next.handle().pipe(
      map((content: object) => {
        this.transactionService
          .create({
            action,
            url: originalUrl,
            result: content,
            user: { id: user?.userId || user?.id },
          })
          .then(() => this.logger.log('Transaction Creted Succesfully'))
          .catch((e) =>
            this.logger.log(`Transaction Failed with Message: ${e.message}`),
          );
        return content;
      }),
    );
  }
}
