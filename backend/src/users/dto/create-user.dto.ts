import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(2)
  password: string

  @IsNotEmpty({ message: 'Username is required' })
  @Length(1, 64)
  username: string

  @IsOptional()
  @IsUrl()
  avatar: string

  @IsOptional()
  @Length(0, 200)
  about: string
}
