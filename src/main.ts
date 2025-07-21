import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000', // หรือ URL ของ frontend
    credentials: true, // 👈 สำคัญมาก
  });

  // ✅ Use cookie parser
  app.use(cookieParser());
  


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
