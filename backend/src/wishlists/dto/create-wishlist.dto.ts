import { IsArray, IsInt, IsUrl, Length } from 'class-validator'

export class CreateWishlistDto {
  @Length(1, 250)
  name: string

  @IsUrl()
  image: string

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[]
}
