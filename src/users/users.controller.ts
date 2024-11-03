import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResultStates } from '../result.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Swagger decorators
@ApiResponse({ status: 404, description: "Not found" })
// Nestjs decorators
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Retrieve all users" })
  @ApiResponse({
    status: 200,
    description: "Successfull response",
    isArray: true,
  })
  async getAllUsers(): Promise<User[]> {
    const result = await this.usersService.getTasks();

    if (result.state == ResultStates.ERROR) {
      throw new HttpException(result.data.message, result.data.statusCode);
    }

    return result.data;
  }
}
