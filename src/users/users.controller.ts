import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResultStates } from '../result.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const result = await this.usersService.getTasks();

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }
}
