import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationService } from './automation.service';
import { AutomationResolver } from './automation.resolver';
import { User } from '../user/entities/user.entity';
import { CardLog } from './entities/card-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CardLog])],
  providers: [AutomationResolver, AutomationService],
})
export class AutomationModule {}
