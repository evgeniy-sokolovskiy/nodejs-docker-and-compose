import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ValidationExceptionFilter } from './filters/badprequest-exception.filter'
import configuration from './configuration/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ValidationExceptionFilter())
  app.enableCors()

  await app.listen(configuration().port)
}
bootstrap()
