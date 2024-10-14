import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateWishDto } from './dto/create-wish.dto'
import { UpdateWishDto } from './dto/update-wish.dto'
import { Wish } from './entities/wish.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, In, Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { IUserJwtResponse } from '../auth/strategy/jwt.strategy'

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(
    ownerId: User['id'],
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const found = await this.usersService.findOne(ownerId)
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...user } = found
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    })
  }

  async findMany(query: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(query)
  }

  async findManyByIds(ids: number[]): Promise<Wish[]> {
    return await this.wishesRepository.findBy({ id: In(ids) })
  }

  async getLastWishes() {
    return this.findMany({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
      take: 40,
    })
  }

  async getTopWishes() {
    return this.findMany({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    })
  }

  async findOne(id: Wish['id']): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    })

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`)
    }

    return wish
  }

  async findByOwner(ownerId: Wish['owner']['id']): Promise<Wish[]> {
    const wish = await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'offers', 'offers.user'],
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        offers: {
          id: true,
          createdAt: true,
          updatedAt: true,
          amount: true,
          hidden: true,
          user: {
            id: true,
            username: true,
            about: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    return wish
  }

  async update(
    ownerId: User['id'],
    id: Wish['id'],
    updateWishDto: UpdateWishDto,
    isRaised: boolean = false,
  ) {
    const currentWish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['offers', 'owner'],
    })
    
    if (currentWish.owner.id !== ownerId && !isRaised) {
      throw new ForbiddenException('You cannot edit other user gifts')
    }

    if (updateWishDto.price && currentWish.raised > 0) {
      throw new ForbiddenException(
          'You cannot change the item price because there are already offers',
      )
    }

    const { offers, ...wishWithoutOffers } = currentWish

    await this.wishesRepository.update(
        { id },
        {
          ...wishWithoutOffers,
          ...updateWishDto,
        },
    )
    
    return await this.findOne(id)
  }

  async remove(id: Wish['id']): Promise<void> {
    const result = await this.wishesRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Wish with ID ${id} not found`)
    }
  }

  async copy(wishId: Wish['id'], user: IUserJwtResponse) {
    const wish = await this.wishesRepository.findOne({
      relations: ['owner'],
      where: { id: wishId },
    })

    if (wish.owner.id === user.userId) {
      throw new ForbiddenException('Copying your own wish is not allowed')
    }

    const ownerWishes = await this.usersService.findWishes(user.userId)

    if (ownerWishes.some((ownerWish) => ownerWish.id === wish.id)) {
      throw new ForbiddenException('You already have copied')
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { id, owner, ...wishData } = wish
    await this.create(user.userId, { ...wishData })
    await this.wishesRepository.increment({ id }, 'copied', 1)
    return wish
  }
}
