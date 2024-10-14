import {forwardRef, Module} from '@nestjs/common'
import {UsersService} from './users.service'
import {UsersController} from './users.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {Wish} from '../wishes/entities/wish.entity'
import {WishesModule} from '../wishes/wishes.module'
import {SharedModule} from "../shared/shared.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Wish]),
        forwardRef(() => WishesModule),
        SharedModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {
}
