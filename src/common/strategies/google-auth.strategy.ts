import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENTID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { name, picture, email } = profile._json;
    const { provider } = profile;
    console.log(name, picture, email, provider);

    try {
      const user = await this.userService.findOneByEmail(email);

      if (user.provider !== provider) {
        console.log(user.provider, provider);
        //done(`you are already subscribed to ${user.provider}`, HttpStatus.CONFLICT)
        throw new HttpException(
          `you are already subscribed to ${user.provider}`,
          HttpStatus.CONFLICT,
        );
      }

      done(null, user);
    } catch (e) {
      if (e.status === 404 || e.status === undefined) {
        //회원가입
        const newUser = await this.userService.createUser({
          email,
          nickname: name,
          provider,
        });
        done(null, newUser);
      }
    }
  }
}
