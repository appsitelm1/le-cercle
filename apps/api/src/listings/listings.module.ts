import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { FavoritesController } from './favorites.controller';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [ListingsController, FavoritesController],
  providers: [ListingsService],
})
export class ListingsModule {}
