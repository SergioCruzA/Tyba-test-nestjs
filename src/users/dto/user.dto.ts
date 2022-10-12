import { IsNotEmpty, MinLength, IsAlphanumeric } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;
}
