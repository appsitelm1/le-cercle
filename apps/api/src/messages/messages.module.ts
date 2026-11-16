import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
