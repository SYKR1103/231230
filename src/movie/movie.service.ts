import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PageOptionDto } from '../common/dtos/page-option.dto';
import { PageMegaDto } from '../common/dtos/page-mega.dto';
import { PageDto } from '../common/dtos/page.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createMovie() {
    const { data, status } = await this.httpService
      .get(this.configService.get('TMDB_URL'), {
        headers: { Authorization: this.configService.get('TMDB_KEY') },
      })
      .toPromise();

    if (status === 200) {
      const datas = data.results;
      const movieData = [];

      datas?.map((data) =>
        movieData.push({
          title: data['title'],
          overview: data['overview'],
          release_date: data['release_date'],
          adult: data['adult'],
          vote_average: data['vote_average'],
        }),
      );
      return await this.movieRepo.save(movieData);
    }
  }

  async getAllMovies(pageOptiondto: PageOptionDto) {
    const queryBuilder = await this.movieRepo.createQueryBuilder('movie');
    await queryBuilder
      .orderBy('movie.createdAt', pageOptiondto.order)
      .skip(pageOptiondto.skip)
      .take(pageOptiondto.take);

    const itemcount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMegaDto = new PageMegaDto({ pageOptiondto, itemcount });
    return new PageDto(entities, pageMegaDto);
  }
}
