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
import { WishesService } from './wishes.service'
import { CreateWishDto } from './dto/create-wish.dto'
import { UpdateWishDto } from './dto/update-wish.dto'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { IUserJwtResponse } from '../auth/strategy/jwt.strategy'

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: Request & { user: IUserJwtResponse },
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(req.user.userId, createWishDto)
  }

  @Get('/last')
  getLastWishes() {
    return this.wishesService.getLastWishes()
  }

  @Get('/top')
  getTopWishes() {
    return this.wishesService.getTopWishes()
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req: Request & { user: IUserJwtResponse },
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(req.user.userId, +id, updateWishDto)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(+id)
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(
    @Req() req: Request & { user: IUserJwtResponse },
    @Param('id') id: string,
  ) {
    return this.wishesService.copy(+id, req.user)
  }
}
