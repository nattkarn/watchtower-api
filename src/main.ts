import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
  .setTitle('Watchtower API')
  .setDescription('API documentation for the Watchtower System')
  .setVersion('1.0')
  .addTag('Watchtower')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // เปิดที่ http://localhost:3000/api-docs

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
