import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'État du service' })
  health() {
    return { status: 'ok', name: 'le cercle API', version: '0.1.0' };
  }

  @Get()
  @ApiOperation({ summary: 'Infos de l’API' })
  root() {
    return this.appService.info();
  }
}
