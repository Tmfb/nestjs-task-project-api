import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/auth.repository';
import { Result, ResultStates } from '../result.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async getTasks(): Promise<Result> {
    let foundUsers;

    try {
      foundUsers = this.usersRepository.find({
        select: { id: true, username: true },
      });
    } catch (error) {
      return new Result(ResultStates.ERROR, {
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return new Result(ResultStates.OK, foundUsers);
  }
}
