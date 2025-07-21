import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountStatus, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { emit } from 'process';

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
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          status: true,
          role: true,
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
          status: user.status,
          password: user.password,
          role: user.role.name,
          tel: user.tel,
          line: user.line,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);

      const userRole = await this.prisma.role.findUnique({
        where: { name:  createUserDto.role},
      });
      if (!userRole) {
        throw new Error('User role not found');
      }

      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          tel: createUserDto.tel,
          line: createUserDto.line,
          password: hashedPassword,
          roleId: userRole.id, // ระบบกำหนด
          status: AccountStatus.ACTIVE,
          activated: true,
        },
        select: {
          id: true,
          username: true,
          email: true,
          tel: true,
          line: true,
          password: true,
          role: true,
        },
      });
      return {
        message: 'User created successfully',
        httpStatus: 201,
        data: {
          id: user.id,
          username: user.username,
          role: user.role.name,
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
        roleId: true,
        role: true,
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
          role: true,
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
          role: user.role.name,
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

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const roleId = await this.prisma.role.findUnique({
        where: { name: updateUserDto.role },
      });

      if (!roleId) {
        throw new NotFoundException('Role not found');
      }
      const updateData: any = {
        tel: updateUserDto.tel,
        line: updateUserDto.line,
        roleId: roleId.id,
        status: updateUserDto.status,
      };

      if (updateUserDto.password && updateUserDto.password.trim() !== '') {
        updateData.password = await hashPassword(updateUserDto.password);
      }

      const user = await this.prisma.user.update({
        where: { id: id },
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
      console.log(error);
      throw new NotFoundException('User not found or update failed');
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: AccountStatus.INACTIVE,
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

  async updateContract(
    id: string,
    updateContractDto: { tel: string; line: string },
  ) {
    try {
      const user = await this.prisma.user.update({
        where: { id: id },
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

  async reviveUser(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: AccountStatus.ACTIVE,
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
        message: 'User revived successfully',
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
}
