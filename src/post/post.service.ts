import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/entities/user.entity';
import { PageOptionDto } from '../common/dtos/page-option.dto';
import { PageMegaDto } from '../common/dtos/page-mega.dto';
import { PageDto } from '../common/dtos/page.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const newPost = await this.postRepo.create({
      ...createPostDto,
      author: user,
    });
    await this.postRepo.save(newPost);
    return newPost;
  }

  async getPosts(pageOptiondto: PageOptionDto): Promise<PageDto<PostEntity>> {
    const querybuilder = await this.postRepo.createQueryBuilder('post');
    await querybuilder
      .orderBy('post.createdAt', pageOptiondto.order)
      .skip(pageOptiondto.skip)
      .take(pageOptiondto.take);

    const itemcount = await querybuilder.getCount();
    const { entities } = await querybuilder.getRawAndEntities();

    const pageMegaDto = new PageMegaDto({ pageOptiondto, itemcount });

    return new PageDto(entities, pageMegaDto);
  }
}
