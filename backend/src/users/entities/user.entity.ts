import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Length, IsOptional, IsUrl, IsEmail } from 'class-validator'
import { Wish } from '../../wishes/entities/wish.entity'
import { Offer } from '../../offers/entities/offer.entity'
import { WishList } from '../../wishlists/entities/wishlist.entity'
import {
  DEFAULT_USER_AVATAR_LINK,
  DEFAULT_USER_DESCRIPTION_TEXT,
} from '../../constants/users'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  @Column({ unique: true })
  @Length(2, 30)
  username: string

  @Column({ default: DEFAULT_USER_DESCRIPTION_TEXT })
  @Length(2, 200)
  @IsOptional()
  about: string

  @Column({ default: DEFAULT_USER_AVATAR_LINK })
  @IsUrl()
  @IsOptional()
  avatar: string

  @Column({ unique: true })
  @IsEmail()
  email: string

  @Column()
  password: string

  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[]

  @OneToMany(() => Offer, (offers) => offers.user)
  offers: Offer[]

  @OneToMany(() => WishList, (wishlists) => wishlists.owner)
  wishlists: WishList[]
}
