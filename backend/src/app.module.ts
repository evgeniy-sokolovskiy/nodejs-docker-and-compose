import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { WishesModule } from './wishes/wishes.module'
import { WishlistsModule } from './wishlists/wishlists.module'
import { OffersModule } from './offers/offers.module'
import { User } from './users/entities/user.entity'
import { Offer } from './offers/entities/offer.entity'
import { Wish } from './wishes/entities/wish.entity'
import { WishList } from './wishlists/entities/wishlist.entity'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.databaseName,
      entities: [User, Offer, Wish, WishList],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
