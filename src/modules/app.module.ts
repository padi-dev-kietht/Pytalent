import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from '../databases/config/index';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  I18nModule,
} from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';

import { HppMiddleware } from '@middleware/hpp.middleware';
import { Users } from '@entities/users.entity';
import { Invitations } from '../entities/invitations.entity';
import { Games } from '../entities/games.entity';
import { Assessments } from '../entities/assessments.entity';
import { AssessmentsResult } from '../entities/assessments_result.entity';
import { Token } from '../entities/token.entity';
import { AssessmentsModule } from './assessment.module';
import { AppController } from '../controllers/app.controller';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';
import { GameResult } from '../entities/game_result.entity';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

const options = databaseConfig as TypeOrmModuleOptions;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    TypeOrmModule.forFeature([
      Users,
      Invitations,
      Games,
      Token,
      Assessments,
      AssessmentsResult,
      GameResult,
    ]),

    TypeOrmModule.forRoot({
      ...options,
      autoLoadEntities: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../../', '/i18n/'),
        watch: true,
      },
      resolvers: [new CookieResolver(), AcceptLanguageResolver],
    }),

    //other module
    UsersModule,
    AuthModule,
    AssessmentsModule,
    //graphQL module
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   typePaths: ['./**/*.graphql'],
    //   definitions: {
    //     path: path.join(process.cwd(), 'src/graphql.ts'),
    //     outputAs: 'class',
    //   },
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HppMiddleware).forRoutes('*');
  }
}
