import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { Wish } from '../wishes/entities/wish.entity'
import { SearchUserDto } from './dto/search-user.dto'
import { WishesService } from '../wishes/wishes.service'
import {BcryptService} from "../shared/services/bcrypt.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
    private bcryptService: BcryptService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    })

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists')
      } else if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists')
      }
    }
    
    createUserDto.password = await this.bcryptService.hashPassword(createUserDto.password)
    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async findOne(id: User['id']) {
    return await this.userRepository.findOneBy({ id })
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async findMany(query: string): Promise<SearchUserDto[]> {
    const users = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        password: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [{ email: query }, { username: query }],
    })
    return users
  }

  async getByName(username: string) {
    return await this.userRepository.findOneBy({ username })
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id,
      },
    })

    await this.userRepository.update(
      { id },
      {
        ...currentUser,
        ...updateUserDto,
      },
    )
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.findOne(id)
    return newUser
  }

  async findUserByUsername(username: string): Promise<Omit<User, 'password'>> {
    const founded = await this.getByName(username)
    if (!founded) {
      throw new ConflictException('User not founded')
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...user } = founded
    return user
  }

  async updateById(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    if (updateUserDto.email) {
      const found = await this.getByEmail(updateUserDto.email)
      if (found && found.id !== id) {
        throw new ConflictException('Email already exists')
      }
    }
    if (updateUserDto.username) {
      const found = await this.getByName(updateUserDto.username)
      if (found && found.id !== id) {
        throw new ConflictException('Username already exists')
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hashPassword(updateUserDto.password)
    }

    return this.update(id, updateUserDto)
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`)
    }

    await this.userRepository.remove(user)
  }

  async findWishes(id: User['id']): Promise<Wish[]> {
    return await this.wishesService.findByOwner(id)
  }
}
