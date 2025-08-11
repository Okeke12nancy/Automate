import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { AutomationModule } from './module/automation/automation.module';
import { DbModule } from './db/db.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      formatError: (error) => {
        const originalError = error.extensions?.originalError as any;
        
        return {
          message: originalError?.message || error.message,
          code: originalError?.statusCode || error.extensions?.code,
          extensions: {
            ...(originalError?.response || {}),
          },
        };
      },
    }),
    UserModule,
    AuthModule,
    AutomationModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
