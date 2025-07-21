import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountStatus } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
      ) {}
    async validateUser(username: string, password: string) {
        const isUserExist = await this.userService.findByUsernameHavePassword({
          username,
        });
    
        // console.log(isUserExist);
    
        if (
          isUserExist &&
          (await bcrypt.compare(password, isUserExist.data.password))
        ) {
          return {
            id: isUserExist.data.id,
            username: isUserExist.data.username,
            role: isUserExist.data.role,
    
          };
        }
        throw new NotFoundException('User not found or password not match');
      }
    
      async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };


        const checkStatus = await this.userService.findByUsername({
          username: user.username,
        });

        if (checkStatus.data.status !== AccountStatus.ACTIVE) {
          return {
            message: 'User not active',
            httpStatus: 401,
          };
        }
        
        console.log("payload", payload);
        return {
          username: user.username,
          role: user.role,
          token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }),
          refreshToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }),
        };
      }

      async verifyToken(token: string) {
        try {
          const verifyToken = await this.jwtService.verify(token);
          if (verifyToken) {
            return true;
          }else{
            return false;
          }
        } catch (error) {
          return false;
        }
      }


      async refresh(token: string) {
        try {
          const payload = await this.jwtService.verify(token);
      
          const user = await this.userService.findByUsername({
            username: payload.username,
          });
      
          if (!user || user.data.status !== AccountStatus.ACTIVE) {
            return {
              httpStatus: 401,
              message: 'Invalid user or inactive',
            };
          }
      
          const newPayload = {
            sub: user.data.id,
            username: user.data.username,
            role: user.data.role,
          };
      
          return {
            token: this.jwtService.sign(newPayload, {
              expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            }),
            message: 'Token refreshed',
            httpStatus: 200,
          };
        } catch (err) {
          console.error('❌ Error verifying refresh token:', err);
          return {
            httpStatus: 401,
            message: 'Invalid or expired refresh token',
          };
        }
      }
      

      
}
