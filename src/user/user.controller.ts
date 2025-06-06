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

  @Get('/find-user/:username')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findUser(@Param('username') username: string) {
    return this.userService.findByUsername({username : username})
  }

  @Patch('/update-user/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('updateUserDto',updateUserDto)
    return this.userService.updateUser(Number(id), updateUserDto)
  }

  @Delete('/delete-user/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id))
  }


  @Patch('/update-contract/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateContract(@Param('id') id: string, @Body() updateContractDto: {tel: string, line: string}) {
    return this.userService.updateContract(Number(id), updateContractDto)
  }


}
