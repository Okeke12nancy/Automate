import { CreateAutomationInput } from './create-automation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAutomationInput extends PartialType(CreateAutomationInput) {
  @Field(() => Int)
  id: number;
}
