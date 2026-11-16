import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
