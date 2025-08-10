import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AutomationResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  errorMessage?: string;
}
