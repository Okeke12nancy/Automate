import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID, { nullable: false })
  // @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  name: string;

  @Column()
  password: string;

  // @Field()
  @Field({ nullable: true })
  @Column({ nullable: true })
  paramountEmail?: string;

  // @Field()
  @Field({ nullable: true })
  @Column({ nullable: true })
  paramountPassword?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
