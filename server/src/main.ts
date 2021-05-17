import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { envConfig } from './commons/configs/env.config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import { sessionConfig, setupSwagger } from './commons/configs';

async function bootstrap() {
  const env = envConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      env.mode === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  const port = env.port;

  // Handle errors
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Allow inject dependency injection in  validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser(env.cookieSecret));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (env.mode === 'production') {
    app.set('trust proxy', 1); // trust first cookie
    app
      .use(compression())
      .use(helmet())
      .use(
        RateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
        }),
      );
  }

  // Session
  const sessionOptions = sessionConfig();
  app.use(session(sessionOptions));

  // Init passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');
  if (env.mode !== 'production') {
    setupSwagger(app);
  }
  await app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/api/docs/`);
  });
}
bootstrap();
