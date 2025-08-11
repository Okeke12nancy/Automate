import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

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
  @IsOptional()
  @IsEmail()
  paramountEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paramountPassword?: string;
}
