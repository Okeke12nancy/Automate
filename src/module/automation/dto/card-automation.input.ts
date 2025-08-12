import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CardAutomationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  zipCode: string;


  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}
