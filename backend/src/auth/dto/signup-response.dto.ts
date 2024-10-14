import { IsDate, IsNumber, IsString } from 'class-validator'

export class SignupResponseDto {
  @IsNumber()
  id: number

  @IsString()
  username: string

  @IsString()
  about: string

  @IsString()
  avatar: string

  @IsString()
  email: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date
}
