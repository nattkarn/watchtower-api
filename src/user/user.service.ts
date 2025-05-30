import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsernameHavePassword(data: { username: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: data.username,

          // TODO: Implement status check after register with mail
          // status: 'active'
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User found successfully',
        httpStatus: 200,
        data: {
          id: user.id,
          username: user.username,
          status: user.status,
          level: user.level,
          tel: user.tel,
          line: user.line,
          password: user.password,
        },
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);

      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          tel: createUserDto.tel,
          line: createUserDto.line,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
        },
      });
      return {
        message: 'User created successfully',
        httpStatus: 201,
        data: {
          id: user.id,
          username: user.username,
        },
      };
    } catch (error) {
      // ตรวจสอบ Prisma unique constraint error (เช่น username หรือ email ซ้ำ)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const field = error.meta?.target?.[0] ?? 'Field';
        throw new BadRequestException(`${field} already exists`);
      }

      console.error('❌ Unexpected error during user creation:', error);
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        tel: true,
        line: true,
        status: true,
        level: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(data: { username: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: data.username,
        },
        select: {
          id: true,
          username: true,
          email: true,
          status: true,
          level: true,
          tel: true,
          line: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User found successfully',
        httpStatus: 200,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          status: user.status,
          level: user.level,
          tel: user.tel,
          line: user.line,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = {
        tel: updateUserDto.tel,
        line: updateUserDto.line,
        level: updateUserDto.level,
        status: updateUserDto.status,
      };
  
      if (updateUserDto.password && updateUserDto.password.trim() !== '') {
        updateData.password = await hashPassword(updateUserDto.password);
      }
  
      const user = await this.prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          tel: true,
          line: true,
        },
      });
  
      return {
        message: 'User updated successfully',
        httpStatus: 200,
        data: user,
      };
  
    } catch (error) {
      throw new NotFoundException('User not found or update failed');
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          status: 'inactive',
        },
        select: {
          id: true,
          username: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User deleted successfully',
        httpStatus: 200,
        data: {
          id: user.id,
          username: user.username,
        },
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateContract(id: number, updateContractDto: {tel: string, line: string}) {
    try {
      const user = await this.prisma.user.update({
        where: { id: Number(id) },
        data: {
          tel: updateContractDto.tel,
          line: updateContractDto.line,
        },
        select: {
          id: true,
          username: true,
          tel: true,
          line: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User updated successfully',
        httpStatus: 200,
        data: user,
      };
    } catch (error) {
      throw new NotFoundException('User not found or update failed');
    }
  }

}
