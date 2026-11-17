import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const corsRaw = (process.env.CORS_ORIGIN || '').trim();
  const origin = !corsRaw || corsRaw === '*' ? '*' : corsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  app.enableCors({ origin });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Le Cercle API')
    .setDescription('API REST `/api/v1` — portail immobilier le cercle')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 API le cercle : http://localhost:${port}/api/v1 — docs: /docs`);
}

void bootstrap();
