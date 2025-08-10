import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsEmail()
  paramountEmail?: string;

  @Field({ nullable: true })
  @IsString()
  paramountPassword?: string;
}
