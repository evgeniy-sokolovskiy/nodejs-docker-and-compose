import { forwardRef, Module } from '@nestjs/common'
import { WishlistsService } from './wishlists.service'
import { WishlistsController } from './wishlists.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WishList } from './entities/wishlist.entity'
import { User } from '../users/entities/user.entity'
import { Wish } from '../wishes/entities/wish.entity'
import { UsersModule } from '../users/users.module'
import { WishesModule } from '../wishes/wishes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([WishList, User, Wish]),
    forwardRef(() => UsersModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
