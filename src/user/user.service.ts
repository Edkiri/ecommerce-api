import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaClient: PrismaClient) {}

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
    return this.prismaClient.user.create({
      data: {
        ...data,
        profile: { create: {} },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prismaClient.user.findFirst({
      where: { email },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaClient.user.findFirst({
      where: { id },
    });
    delete user.password;
    return user;
  }
}
