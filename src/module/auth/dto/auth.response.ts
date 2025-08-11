import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}
