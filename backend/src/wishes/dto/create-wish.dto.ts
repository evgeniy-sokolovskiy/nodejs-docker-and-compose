import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator'

export class CreateWishDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  @Length(1, 250)
  name: string

  @IsNotEmpty({ message: 'link is required' })
  @IsString()
  link: string

  @IsNotEmpty({ message: 'image is required' })
  @IsUrl()
  image: string

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Min(1)
  price: number

  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  @Length(1, 1024)
  description: string
}
