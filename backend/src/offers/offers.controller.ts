import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { OffersService } from './offers.service'
import { CreateOfferDto } from './dto/create-offer.dto'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { IUserJwtResponse } from '../auth/strategy/jwt.strategy'
import { Offer } from './entities/offer.entity'

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll() {
    return this.offersService.findAll()
  }

  @Post()
  async create(
    @Req() req: Request & { user: IUserJwtResponse },
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offersService.create(createOfferDto, req.user.userId)
  }

  @Get(':id')
  async findOne(@Param('id') id: Offer['id']) {
    return this.offersService.findOne(id)
  }
}
