import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

import { GoogleService } from './common/services/google-maps/google-maps-service';
import { QueryRestaurantDto } from './restaurants/dto/get-restaurant-dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private googleService: GoogleService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurants')
  getProfile(@Query() query: QueryRestaurantDto) {
    return this.googleService.getRestaurants(query);
  }
}
