import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderConstraint } from '../constraints/order-constraint';
import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PageOptionDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  readonly take: number = 10;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  readonly page: number = 1;

  @ApiPropertyOptional({ enum: OrderConstraint, default: OrderConstraint.ASC })
  @IsEnum(OrderConstraint)
  @IsOptional()
  readonly order: OrderConstraint = OrderConstraint.ASC;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
