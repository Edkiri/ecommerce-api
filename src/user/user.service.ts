import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

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
    return this.prismaClient.user.create({
      data: {
        ...data,
        profile: { create: {} },
      },
    });
  }
}
