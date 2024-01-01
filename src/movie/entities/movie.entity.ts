import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Movie extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public overview: string;

  @Column()
  public release_date: string;

  @Column()
  public adult: boolean;

  @Column()
  public vote_average: string;
}
