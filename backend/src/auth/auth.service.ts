import { Injectable } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { SignupResponseDto } from './dto/signup-response.dto'
import {BcryptService} from "../shared/services/bcrypt.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private bcryptService: BcryptService
  ) {}

  async auth(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    }
    return { access_token: this.jwtService.sign(payload) }
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<SignupResponseDto> {
    const user = await this.usersService.getByName(username)
    if (user && (await this.bcryptService.comparePassword(password, user.password))) {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { password, wishes, offers, wishlists, ...result } = user
      return result
    }
    return
  }
}
