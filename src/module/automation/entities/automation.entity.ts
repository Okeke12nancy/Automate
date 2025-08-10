import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Automation {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
