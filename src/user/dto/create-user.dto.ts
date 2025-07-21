import { IsEmail, IsEnum, IsIn, IsString, MinLength } from 'class-validator';
import { UniqueUsername } from '../dto/unique-username.validator';
import { UniqueEmail } from '../dto/unique-email.validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the user',
  })
  @IsString()
  @MinLength(3)
  @UniqueUsername()
  username: string;

  @ApiProperty({
    example: 'P@ssword123',
    description: 'Password of the user (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '0812345678',
    description: 'Phone number (optional)',
    required: false,
  })
  @IsString()
  tel?: string;

  @ApiProperty({
    example: 'johnline',
    description: 'Line ID (optional)',
    required: false,
  })
  @IsString()
  line?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @UniqueEmail()
  email: string;

  @ApiProperty({
    example: 'active',
    description: 'User status',
    enum: ['active', 'inactive'],
  })
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;

  @ApiProperty({
    example: 'user',
    description: 'User level',
    enum: ['user', 'admin'],
  })
  @IsEnum(Role, {
    message: 'Level must be either "ADMIN" or "USER"',
  })
  role: Role;
}
