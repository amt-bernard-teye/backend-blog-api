import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 

  app.setGlobalPrefix("/api");
  app.use(morgan('tiny'));
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4200']
  });
  
  const config = new DocumentBuilder()
    .setTitle("Blog Api")
    .setDescription("A simple blog api where an admin can post blog and readers can read and comment on posts")
    .setVersion("1.0.0")
    .addServer("http://localhost:8000", "local server")
    .addBearerAuth()
    .addTag("App")
    .addTag("Auth")
    .addTag("Categories")
    .addTag("Post")
    .addTag("Comments")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api-docs", app, document);

  await app.listen(8000);
}
bootstrap();
