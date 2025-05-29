import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @HttpCode(201)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUser() {
    return this.userService.findAll()
  }

  @Post('/user-info')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  userInfo(@Request() req: any) {
    console.log('user',req.user)
    return this.userService.findByUsername({username : req.user.username})
  }



}
