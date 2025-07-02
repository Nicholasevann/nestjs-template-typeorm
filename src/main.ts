import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // <-- This enables type conversion
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
}
bootstrap();
