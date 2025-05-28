import { IsEmail, IsIn, IsNumber, IsString, MinLength } from 'class-validator';
import { UniqueUsername } from '../dto/unique-username.validator';
import { UniqueEmail } from '../dto/unique-email.validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(3)
  @UniqueUsername()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  tel?: string;

  @IsString()
  line?: string;

  @IsEmail()
  @UniqueEmail()
  email: string;

  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;

  @IsString()
  @IsIn(['user', 'admin'], {
    message: 'Level must be either "user", or "admin"',
  })
  level: string;
}
