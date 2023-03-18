import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @IsNotEmpty()
  @IsString()
  verificationToken: string;
}
