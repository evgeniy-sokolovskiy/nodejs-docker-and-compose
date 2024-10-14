import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Wish } from '../../wishes/entities/wish.entity'
import {IsBoolean, IsDate, IsDecimal, IsNotEmpty, IsNumber} from "class-validator";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number

  @Column()
  @CreateDateColumn()
  @IsDate()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: {
      to: (value: number): number => {
        return parseFloat(value.toFixed(2))
      },
      from: (value: string): number => {
        return parseFloat(value)
      },
    },
  })
  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  amount: number

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  hidden: boolean
}
