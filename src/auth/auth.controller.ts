import {
  Controller,
  Post,
  Inject,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalGuard } from './guards/local-guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated-guard';
import { VerifyUserDto } from './dto/verify-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @Get('verify')
  activateUser(@Query() query: VerifyUserDto) {
    return this.authService.activateUser(query);
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('session-status')
  getSessionStatus() {
    return {
      mesagge: 'The user is authenticated!',
    };
  }
}
