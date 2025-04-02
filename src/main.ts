import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { errorMiddleware } from './middleware/error.middleware';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

    app.use(errorMiddleware);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error(`❌ Failed to start the application`, error);
    process.exit(1);
  }
}

bootstrap();
