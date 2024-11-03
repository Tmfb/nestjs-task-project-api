import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./transform.interceptor";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger("Bootstrap", { timestamp: true });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle("Project-Task API Documentation")
    .setDescription("A NestJS API for managing tasks and projects, featuring user authentication with JWT, role-based permissions, and TypeORM integration for relational database management.")
    .setVersion("1.0")
    .addTag("Tasks")
    .addTag("Projects")
    .addTag("Users")
    .addTag("Authentication")
    .addBearerAuth()
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module
  SwaggerModule.setup("api", app, document, {
    jsonDocumentUrl: "api/json",
  });

  const port = 3000;
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
