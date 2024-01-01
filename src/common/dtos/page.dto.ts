import { IsArray } from 'class-validator';
import { PageMegaDto } from './page-mega.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMegaDto })
  readonly mega: any;

  constructor(data: T[], mega: PageMegaDto) {
    this.data = data;
    this.mega = mega;
  }
}
