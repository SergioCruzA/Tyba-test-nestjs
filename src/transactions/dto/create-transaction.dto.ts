import { IsNotEmpty, IsOptional, MinLength, IsObject } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @MinLength(10)
  action: string;

  @IsNotEmpty()
  @MinLength(10)
  url: string;

  @IsNotEmpty()
  @IsObject()
  result: object;

  @IsOptional()
  @IsObject()
  user?: object;
}
