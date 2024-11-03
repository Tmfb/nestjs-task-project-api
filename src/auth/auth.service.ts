import { Injectable, Logger } from "@nestjs/common";
import {
  NotFoundException,
} from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "./auth.repository";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt/dist";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async singIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.getUserWithPassword(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payloard: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payloard);
      this.logger.log(`User: ${username} signed in`);
      return { accessToken };
    } else {
      throw new NotFoundException("Please check your login credentials");
    }
  }
}
