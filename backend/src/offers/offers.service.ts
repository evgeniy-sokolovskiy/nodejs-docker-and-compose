import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Offer } from './entities/offer.entity'
import { CreateOfferDto } from './dto/create-offer.dto'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { WishesService } from '../wishes/wishes.service'

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    userId: User['id'],
  ): Promise<Offer> {
    const user = await this.usersService.findOne(userId)
    const wish = await this.wishesService.findOne(createOfferDto.itemId)

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Contributing to your own gifts is not allowed',
      )
    }
    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new BadRequestException(
        'The amount is greater than the remaining balance for the collection',
      )
    }

    await this.wishesService.update(userId, createOfferDto.itemId, {
      raised: Number(wish.raised) + createOfferDto.amount,
    }, true)

    return await this.offerRepository.save({
      user,
      item: wish,
      ...createOfferDto,
    })
  }

  async findOne(id: Offer['id']): Promise<Offer> {
    const offer = await this.offerRepository.findOneBy({ id })
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`)
    }
    return offer
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user'],
    })
    if (offers.length === 0) {
      throw new NotFoundException('No offers found')
    }
    return offers
  }
}
