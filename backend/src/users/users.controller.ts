import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { IUserJwtResponse } from '../auth/strategy/jwt.strategy'
import { Wish } from '../wishes/entities/wish.entity'
import { SearchUserDto } from './dto/search-user.dto'

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAllUsers(): Promise<SearchUserDto[]> {
    return await this.usersService.findAll()
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<SearchUserDto> {
    return this.usersService.create(createUserDto)
  }

  @Get('/me')
  async getCurrentUser(
    @Req() req: Request & { user: IUserJwtResponse },
  ): Promise<User> {
    return await this.usersService.findOne(req.user.userId)
  }

  @Patch('/me')
  async updateCurrentUser(
    @Req() req: Request & { user: IUserJwtResponse },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SearchUserDto> {
    return this.usersService.updateById(req.user.userId, updateUserDto)
  }
  @Get('/me/wishes')
  async getCurrentUserWishes(
    @Req() req: Request & { user: IUserJwtResponse },
  ): Promise<Wish[]> {
    return await this.usersService.findWishes(req.user.userId)
  }

  @Get(':username')
  async findByUserName(
    @Param('username') username: string,
  ): Promise<SearchUserDto> {
    return await this.usersService.findUserByUsername(username)
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const founded = await this.usersService.findUserByUsername(username)
    return await this.usersService.findWishes(founded.id)
  }

  @Post('find')
  findMany(@Body('query') query: string): Promise<SearchUserDto[]> {
    return this.usersService.findMany(query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
