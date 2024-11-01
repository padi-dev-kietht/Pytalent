import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from '../databases/config/index';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';

import { HppMiddleware } from '@middleware/hpp.middleware';
import { Users } from '@entities/users.entity';
import { Invitations } from '../entities/invitations.entity';
import { Games } from '../entities/games.entity';
import { Assessments } from '../entities/assessments.entity';
import { Token } from '../entities/token.entity';
import { AssessmentsModule } from './assessment.module';
import { AppController } from '../controllers/app.controller';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';
import { GameResult } from '../entities/game_result.entity';
import { GameAnswer } from '../entities/game_answer.entity';
import { LogicalQuestions } from '../entities/logical_questions.entity';
import { MemoryGame } from '../entities/memory_game.entity';
import { GameAnswerModule } from './gameAnswer.module';
import { LogicalQuestionsModule } from './logicalQuestion.module';
import { MemoryGameModule } from './memoryGame.module';
import { InvitationsModule } from './invitations.module';
import { GamesModule } from './game.module';
import { GameQuestions } from '../entities/game_questions.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LogicalQuestionsGameModule } from './logicalQuestionsGame.module';
import { BullMqModule } from './bullmq.module';
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
      GameResult,
      GameAnswer,
      LogicalQuestions,
      MemoryGame,
      GameQuestions,
    ]),

    TypeOrmModule.forRoot({
      ...options,
      autoLoadEntities: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '../../', '/i18n/'),
        watch: true,
      },
      resolvers: [new CookieResolver(), AcceptLanguageResolver],
    }),

    //other module
    BullMqModule,
    UsersModule,
    AuthModule,
    AssessmentsModule,
    GamesModule,
    GameAnswerModule,
    LogicalQuestionsModule,
    MemoryGameModule,
    forwardRef(() => InvitationsModule),
    LogicalQuestionsGameModule,
    ScheduleModule.forRoot(),

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
