import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(loginInput.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async validateUser(id: string) {
    return this.userService.findOne(id);
  }
}
