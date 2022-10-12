import {
  IsOptional,
  IsLatitude,
  IsLongitude,
  MinLength,
} from 'class-validator';

export class QueryRestaurantDto {
  @IsOptional()
  @MinLength(4)
  city: string;

  @IsOptional()
  @IsLatitude()
  lattitude?: string;

  @IsOptional()
  @IsLongitude()
  longitude?: string;
}
