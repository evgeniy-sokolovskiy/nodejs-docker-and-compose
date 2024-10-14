import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { WishlistsService } from './wishlists.service'
import { CreateWishlistDto } from './dto/create-wishlist.dto'
import { IUserJwtResponse } from '../auth/strategy/jwt.strategy'
import { WishList } from './entities/wishlist.entity'
import { UpdateWishlistDto } from './dto/update-wishlist.dto'

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Req() req: Request & { user: IUserJwtResponse },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishList> {
    return this.wishlistsService.create(req.user.userId, createWishlistDto)
  }

  @Get()
  findWishlist(
    @Req() req: Request & { user: IUserJwtResponse },
  ): Promise<WishList[]> {
    return this.wishlistsService.findWishlistByOwner(req.user.userId)
  }

  @Get(':id')
  findWishes(@Param('id') id: string): Promise<WishList> {
    return this.wishlistsService.findWishlist(+id)
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: IUserJwtResponse },
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishList> {
    return this.wishlistsService.updateWishlist(
      req.user.userId,
      +id,
      updateWishlistDto,
    )
  }

  @Delete(':id')
  remove(
    @Req() req: Request & { user: IUserJwtResponse },
    @Param('id') id: string,
  ): Promise<WishList> {
    return this.wishlistsService.remove(+id, req.user.userId)
  }
}
