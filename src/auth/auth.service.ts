import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/signin.dto';
import { RefreshToken } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || '3600',
      audience: process.env.JWT_TOKEN_AUDIENCE,
      issuer: process.env.JWT_TOKEN_ISSUER,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_TTL || '86400',
      audience: process.env.JWT_TOKEN_AUDIENCE,
      issuer: process.env.JWT_TOKEN_ISSUER,
    });

    return {
      message: 'Sign in successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshToken) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          audience: process.env.JWT_TOKEN_AUDIENCE,
          issuer: process.env.JWT_TOKEN_ISSUER,
        },
      );

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      const newPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || '3600',
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
      });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_TTL || '86400',
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
      });

      return {
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token' + e);
    }
  }
}
