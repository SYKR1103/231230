import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findOneById(id: string) {
    const foundUser = await this.userRepo.findOneBy({ id });
    if (!foundUser) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return foundUser;
  }

  async findOneByEmail(email: string) {
    const foundUser = await this.userRepo.findOneBy({ email });
    if (!foundUser) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return foundUser;
  }
}
