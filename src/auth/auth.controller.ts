import { Controller, Post, Inject, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalGuard } from './guards/local-guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated-guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('session-status')
  getSessionStatus() {
    return {
      mesagge: 'The user is authenticated!',
    };
  }
}
