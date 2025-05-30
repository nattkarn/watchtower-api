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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    // console.log(req)
    const login = await this.authService.login(req.user);

    res.cookie('watchtower_user_token', login.token, {
      httpOnly: true, // ✅ Token ปลอดภัย ไม่ให้ JS/Middleware อ่าน
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000, // 1 day
      // domain: '192.168.1.184'
    });

    res.cookie('watchtower_user_level', login.level, {
      httpOnly: false, // ✅ ให้ Middleware อ่านได้
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000, // 1 day
      // domain: '192.168.1.184'
    });

    res.cookie('watchtower_user_name', login.username, {
      httpOnly: false, // ✅ ให้ Middleware อ่านได้
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000, // 1 day
      // domain: '192.168.1.184'
    });
    return login;
  }

  @Post('/logout')
  @HttpCode(200)
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
}
