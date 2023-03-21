import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { AllExceptionsFilter } from './utils/globalErrorHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configure prisma enableShutdownHooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // enable cors
  app.enableCors();

  // added global error exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
