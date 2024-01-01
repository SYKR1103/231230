import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { query } from 'express';
import { PageOptionDto } from '../common/dtos/page-option.dto';
import { PageDto } from '../common/dtos/page.dto';
import { Movie } from './entities/movie.entity';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createPost() {
    return await this.movieService.createMovie();
  }

  @Get('/all')
  async getAllMovies(
    @Query() pageOptiondto: PageOptionDto,
  ): Promise<PageDto<Movie>> {
    return await this.movieService.getAllMovies(pageOptiondto);
  }
}
