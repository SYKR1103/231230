import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { TokenPayload } from '../interfaces/tokenPayload';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: TokenPayload) {
    return this.userService.findOneById(payload.userId);
  }
}
