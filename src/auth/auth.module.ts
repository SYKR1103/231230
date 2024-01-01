import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthStrategy } from '../common/strategies/local-auth.strategy';
import { JwtAuthStrategy } from '../common/strategies/jwt-auth.strategy';
import { EmailModule } from '../email/email.module';
import { RedisModule } from '../redis/redis.module';
import { GoogleAuthStrategy } from '../common/strategies/google-auth.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({}),
    EmailModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAuthStrategy,
    GoogleAuthStrategy,
  ],
})
export class AuthModule {}
