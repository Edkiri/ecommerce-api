import { Module, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
