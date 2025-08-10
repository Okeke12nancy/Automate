import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CardLog } from './entities/card-log.entity';
import { CardAutomationInput } from './dto/card-automation.input';
import { AutomationResponse } from './dto/automation.response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
export class AutomationResolver {
  constructor(private readonly automationService: AutomationService) {}

  @Mutation(() => AutomationResponse)
  @UseGuards(JwtAuthGuard)
  addCardToParamount(@Args('input') input: CardAutomationInput) {
    return this.automationService.addCardToParamount(input);
  }

  @Query(() => [CardLog], { name: 'cardLogs' })
  @UseGuards(JwtAuthGuard)
  getCardLogs(@Args('userId', { type: () => ID }) userId: string) {
    return this.automationService.getCardLogs(userId);
  }
}
