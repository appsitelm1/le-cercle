import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  info() {
    return {
      name: 'le cercle API',
      description: 'API REST /api/v1 — portail immobilier le cercle',
      docs: '/docs',
      health: '/api/v1/health',
    };
  }
}
