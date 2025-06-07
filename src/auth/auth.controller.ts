import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';

// Swagger imports
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User Login', description: 'Login user and set cookies' })
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const login = await this.authService.login(req.user);

    res.cookie('watchtower_user_token', login.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000,
    });

    res.cookie('watchtower_user_level', login.level, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000,
    });

    res.cookie('watchtower_user_name', login.username, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000,
    });
    return login;
  }

  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'User Logout', description: 'Clear cookies and logout' })
  @ApiResponse({ status: 200, description: 'Logout success' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('watchtower_user_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    res.cookie('watchtower_user_level', '', {
      httpOnly: false,
      maxAge: 0,
      path: '/',
    });

    res.cookie('watchtower_user_name', '', {
      httpOnly: false,
      maxAge: 0,
      path: '/',
    });

    return { success: true };
  }

  @Post('/verify-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify Token', description: 'Verify JWT token validity' })
  @ApiResponse({ status: 200, description: 'Token verified' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async verifyToken(@Request() req: any) {
    const verifyToken = await this.authService.verifyToken(req.body.token);
    return verifyToken;
  }
}
