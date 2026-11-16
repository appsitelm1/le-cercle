import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
