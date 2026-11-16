import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(): Promise<Record<string, unknown>> {
    const rows = await this.prisma.setting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async set(patch: Record<string, unknown>) {
    for (const [key, value] of Object.entries(patch)) {
      await this.prisma.setting.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      });
    }
    return this.get();
  }
}
