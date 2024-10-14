import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateWishlistDto } from './dto/create-wishlist.dto'
import { UpdateWishlistDto } from './dto/update-wishlist.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from 'src/users/users.service'
import { WishesService } from 'src/wishes/wishes.service'
import { User } from 'src/users/entities/user.entity'
import { WishList } from './entities/wishlist.entity'
import { Wish } from '../wishes/entities/wish.entity'

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistRepository: Repository<WishList>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  async create(userId: User['id'], createWishlistDto: CreateWishlistDto) {
    const user = await this.usersService.findOne(userId)
    const items = await this.wishService.findManyByIds(
      createWishlistDto.itemsId,
    )

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: items,
    })

    return await this.wishlistRepository.save(wishlist)
  }

  async findWishlistByOwner(userId: User['id']) {
    const wishlist = await this.wishlistRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'items'],
    })
    return wishlist
  }

  async findWishlist(id: WishList['id']) {
    return await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items'],
    })
  }

  async updateWishlist(
    userId: User['id'],
    id: WishList['id'],
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishList> {
    const { itemsId, ...wishListData } = updateWishlistDto
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    })

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot edit other user wishlist')
    }

    const newItemsWishlist: Wish[] = []
    if (itemsId) {
      const wishes = await Promise.all(
        updateWishlistDto.itemsId.map((id) => this.wishService.findOne(id)),
      )
      newItemsWishlist.concat(wishes)
    }

    const updateWishlist = {
      ...wishlist,
      ...wishListData,
      ...(newItemsWishlist.length ? { itemsId: [...newItemsWishlist] } : {}),
    }

    return this.wishlistRepository.save(updateWishlist)
  }

  async remove(id: WishList['id'], userId: User['id']) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    })
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot delete other user wishlist')
    }
    return await this.wishlistRepository.remove(wishlist)
  }
}
