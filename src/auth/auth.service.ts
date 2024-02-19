import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(
    username: string,
    password: string,
  ): Promise<{ ACCESS_TOKEN: string }> {
    const user = await this.usersService.getUserByEmail(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    return { ACCESS_TOKEN: await this.jwtService.signAsync(payload) };
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
}
