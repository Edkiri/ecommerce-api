import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async findUser(userId: string) {
    return this.userService.findOne(userId);
  }

  async activateUser(query: VerifyUserDto) {
    const { userId, verificationToken } = query;
    await this.userService.findUserByIdAndActivationToken(
      userId,
      verificationToken,
    );
    await this.userService.activateUser(userId, verificationToken);
    return { message: 'User successfully activated' };
  }
}
