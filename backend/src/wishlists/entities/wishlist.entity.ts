import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm'
import { Length, IsUrl, IsEmpty } from 'class-validator'
import { Wish } from '../../wishes/entities/wish.entity'
import { User } from '../../users/entities/user.entity'
import { DEFAULT_WISHLIST_DESCRIPTION_TEXT } from '../../constants/users'

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  @Length(1, 250)
  name: string

  @Column({ default: DEFAULT_WISHLIST_DESCRIPTION_TEXT })
  @IsEmpty()
  @Length(0, 1500)
  description: string

  @Column()
  @IsUrl()
  image: string

  @ManyToMany(() => Wish, (wishes) => wishes.wishlist)
  items: Wish[]

  @ManyToOne(() => User, (users) => users.wishlists)
  owner: User
}
