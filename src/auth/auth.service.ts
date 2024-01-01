import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayload } from '../common/interfaces/tokenPayload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return this.userService.findOneByEmail(loginUserDto.email);
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async emailTest(email: string) {
    const verificationCode = this.generateOTP();
    console.log(verificationCode);
    await this.emailService.sendMail({
      to: email,
      subject: 'verification code',
      text: `verification code is ${verificationCode}`,
    });
    await this.cacheManager.set(email, verificationCode);
    return 'success';
  }

  async emailCheck(email: string, code: string) {
    const ver_code = await this.cacheManager.get(email);
    if (ver_code !== code) throw new InternalServerErrorException();
    await this.cacheManager.del(email);
    return true;
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 20; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
