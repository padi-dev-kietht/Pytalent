import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { AppModule } from '@modules/app/app.module';
import { env } from '@env';

// import { csrfConfigPlugin, setI18nPlugin } from '@plugins';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AllExceptionsFilter } from '@exception/handle.exception';

const allowedOrigins = [
  // WEBSITES
  // 'http://localhost',
];
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //static asset config
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });

  // PARSE REQUESTS
  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      limit: '10mb',
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  //security
  app.use(helmet());
  // Enable Cross-origin resource sharing for a list of domains
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  const port = env.app.port || 3000;

  await app.listen(port);
  console.log(`app running at http://localhost:${port}/`);
}
bootstrap();
