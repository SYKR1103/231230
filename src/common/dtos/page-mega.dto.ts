import { ApiProperty } from '@nestjs/swagger';
import { PagemegadataDto } from '../interfaces/pagemegadata.dto';

export class PageMegaDto {
  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly hasPrevious: boolean;

  @ApiProperty()
  readonly hasNext: boolean;

  constructor({ pageOptiondto, itemcount }: PagemegadataDto) {
    this.page = pageOptiondto.page;
    this.take = pageOptiondto.take;
    this.totalPages = Math.ceil(this.itemCount / this.take);
    this.itemCount = itemcount;
    this.hasNext = this.page < this.totalPages;
    this.hasPrevious = this.page > 1;
  }
}
