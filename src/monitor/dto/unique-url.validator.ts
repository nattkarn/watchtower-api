import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from 'src/prisma/prisma.service';
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class UniqueUrlConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
  
    async validate(url: string, _args: ValidationArguments): Promise<boolean> {
      const user = await this.prisma.url.findUnique({ where: { url } });
      return !user; // true if username is unique
    }
  
    defaultMessage(_args: ValidationArguments) {
      return 'URL already in use';
    }
  }
  
  export function UniqueUrl(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        name: 'UniqueUrl',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: UniqueUrlConstraint,
      });
    };
  }
  