import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UseFilters,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { User } from '../users/entities/user.entity'
import { LocalGuard } from './guards/local.guard'
import { SigninResponseDto } from './dto/signin-response.dto'
import { SignupResponseDto } from './dto/signup-response.dto'
import { ValidationExceptionFilter } from '../filters/badprequest-exception.filter'

@UseFilters(new ValidationExceptionFilter())
@Controller('/')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: Record<'user', User>): Promise<SigninResponseDto> {
    return this.authService.auth(req.user)
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupResponseDto> {
    const user = await this.usersService.create(createUserDto)
    await this.authService.auth(user)
    const {password, ...response} = user
    return response
  }
}
