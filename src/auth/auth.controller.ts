import { Controller } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.singUp(authCredentialsDto);
  }
}
