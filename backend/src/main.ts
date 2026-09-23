import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { ok } from './utils/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new ErrorHandlerMiddleware());

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/health', (_req, res) => {
    res.json(ok({ status: 'ok', service: 'construction-tracker-backend' }));
  });

  await app.listen(Number(process.env.PORT || 3000), '0.0.0.0');
}

bootstrap();
