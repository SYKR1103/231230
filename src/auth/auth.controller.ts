import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { RequestWithUser } from '../common/interfaces/requestWithUser';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async loginUser(@Body() loginUserDto: LoginUserDto) {
  //   const user = await this.authService.loginUser(loginUserDto);
  //   const token = await this.authService.generateAccessToken(user.id);
  //   return { user, token };
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() requestWithUser: RequestWithUser) {
    const { user } = requestWithUser;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInfo(@Req() requestWithUser: RequestWithUser) {
    return requestWithUser.user;
  }

  @Post('email/send')
  async emailSend(@Body('email') email: string) {
    return this.authService.emailTest(email);
  }

  @Post('email/check')
  async emailCheck(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.emailCheck(email, code);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    return HttpStatus.OK;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() requestWithUser: RequestWithUser) {
    const { user } = requestWithUser;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }
}
