import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guard/roles.guard';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors config
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // set global prefix
  app.setGlobalPrefix('api/v1');

  // global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // global auth
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // roles guard
  app.useGlobalGuards(new RolesGuard(reflector));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
