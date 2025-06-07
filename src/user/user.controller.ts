import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('User') // ⭐ Group ใน Swagger
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Signup new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  getAllUser() {
    return this.userService.findAll()
  }

  @Post('/user-info')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user info from token' })
  @ApiResponse({ status: 200, description: 'User info' })
  userInfo(@Request() req: any) {
    return this.userService.findByUsername({username : req.user.username})
  }

  @Get('/find-user/:username')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find user by username' })
  @ApiResponse({ status: 200, description: 'User info' })
  findUser(@Param('username') username: string) {
    return this.userService.findByUsername({username : username})
  }

  @Patch('/update-user/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(Number(id), updateUserDto)
  }

  @Delete('/delete-user/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id))
  }

  @Patch('/update-contract/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user contact' })
  @ApiResponse({ status: 200, description: 'User contact updated' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tel: { type: 'string' },
        line: { type: 'string' },
      },
    },
  })
  updateContract(@Param('id') id: string, @Body() updateContractDto: {tel: string, line: string}) {
    return this.userService.updateContract(Number(id), updateContractDto)
  }
}



