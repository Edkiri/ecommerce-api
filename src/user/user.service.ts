import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserPayload } from './interfaces/verify-user-payload.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    const oldUser = await this.prismaClient.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (oldUser) {
      throw new BadRequestException('An user with this email already exists');
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;
    const user = await this.prismaClient.user.create({
      data: {
        ...data,
        profile: { create: {} },
      },
    });
    const userId = user.id;
    const payload: VerifyUserPayload = { type: 'Activation Token', userId };
    const token = this.jwtService.sign(payload);
    await this.prismaClient.activationToken.create({ data: { userId, token } });
    delete user.password;
    return user;
  }

  async findByEmail(email: string) {
    return this.prismaClient.user.findFirst({
      where: { email },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaClient.user.findFirst({
      where: { id },
    });
    return user;
  }

  async activateUser(id: string, token: string) {
    try {
      const payload: VerifyUserPayload = await this.jwtService.verify(token);
      if (payload.type !== 'Activation Token' || payload.userId !== id) {
        throw new Error();
      }
      this.prismaClient.activationToken.delete({ where: { userId: id } });
      return this.prismaClient.user.update({
        where: { id },
        data: { isVerified: true },
      });
    } catch (_: any) {
      throw new UnprocessableEntityException('This action can not be perfomed');
    }
  }
}
