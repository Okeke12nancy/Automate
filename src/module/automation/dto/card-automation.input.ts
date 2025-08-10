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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cardholderName?: string;
}
