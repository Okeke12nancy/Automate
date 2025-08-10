import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../module/user/entities/user.entity';
import { CardLog } from '../module/automation/entities/card-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'automation',
      entities: [User, CardLog],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DbModule {}
