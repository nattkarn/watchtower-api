import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
            level: isUserExist.data.level,
    
          };
        }
        throw new NotFoundException('User not found or password not match');
      }
    
      async login(user: any) {
        const payload = { username: user.username, id: user.id, level: user.level };


        const checkStatus = await this.userService.findByUsername({
          username: user.username,
        });

        if (checkStatus.data.status !== 'active') {
          return {
            message: 'User not active',
            httpStatus: 401,
          };
        }
        
        console.log("payload", payload);
        return {
          username: user.username,
          level: user.level,
          token: this.jwtService.sign(payload),
        };
      }

      

      
}
