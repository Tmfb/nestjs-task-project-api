import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
  private logger = new Logger('Usersrepository');
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    //  Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    //  Create user
    const user = this.create({
      username,
      password: hashedPassword,
    });
    //  Save to the database
    try {
      await this.save(user);
      this.logger.log(
        `Username ${user.username} with id ${user.id} signed up sucesfuly`,
      );
    } catch (error) {
      if (error.code == 23505) {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserWithPassword(username: string): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.where('user.username = :username', { username });
    query.addSelect('user.password');

    const user = await query.getOne();

    return user;
  }
}
