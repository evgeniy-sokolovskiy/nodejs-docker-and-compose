import { Module } from '@nestjs/common'
import { OffersService } from './offers.service'
import { OffersController } from './offers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Offer } from './entities/offer.entity'
import { Wish } from '../wishes/entities/wish.entity'
import { User } from '../users/entities/user.entity'
import { WishesService } from '../wishes/wishes.service'
import { UsersService } from '../users/users.service'
import {SharedModule} from "../shared/shared.module";

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish, User]), SharedModule],
  controllers: [OffersController],
  providers: [OffersService, WishesService, UsersService],
})
export class OffersModule {}
