import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { MediaModule } from './media/media.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MessagesModule } from './messages/messages.module';
import { LeadsModule } from './leads/leads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { CatalogModule } from './catalog/catalog.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ListingsModule,
    MediaModule,
    ProfessionalsModule,
    SchedulerModule,
    MessagesModule,
    LeadsModule,
    NotificationsModule,
    AdminModule,
    SettingsModule,
    CatalogModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
