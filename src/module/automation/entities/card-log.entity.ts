import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class CardLog {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  action: string;

  @Field()
  @Column()
  status: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cardLastFour?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cardType?: string;

  @Field()
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
