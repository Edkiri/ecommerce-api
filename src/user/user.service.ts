import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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
    const payload: VerifyUserPayload = { type: 'Activation Token' };
    const user = await this.prismaClient.user.create({
      data: {
        ...data,
        verificationToken: this.jwtService.sign(payload),
        profile: { create: {} },
      },
    });
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
      if (payload.type !== 'Activation Token') {
        throw new Error();
      }
      return this.prismaClient.user.update({
        where: { id },
        data: { isVerified: true },
      });
    } catch (_: any) {
      throw new UnprocessableEntityException('This action can not be perfomed');
    }
  }

  async findUserByIdAndActivationToken(id: string, verificationToken: string) {
    try {
      const user = await this.prismaClient.user.findFirstOrThrow({
        where: { id, verificationToken },
      });
      return user;
    } catch (_: any) {
      throw new UnprocessableEntityException(
        'This action can not be performed',
      );
    }
  }
}
