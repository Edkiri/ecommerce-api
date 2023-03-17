import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './db/prisma.module';
import { UserModule } from './user/user.moudule';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
