import { IsInt, IsString, IsUrl, IsDate, IsOptional } from 'class-validator'

export class SearchUserDto {
  @IsInt()
  id: number

  @IsString()
  username: string

  @IsString()
  @IsOptional()
  about: string

  @IsUrl()
  avatar: string

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date
}
