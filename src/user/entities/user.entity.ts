import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProviderEnum } from './provider.enum';
import { PostEntity } from '../../post/entities/post.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public nickname: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  public posts?: PostEntity;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.Local,
  })
  public provider: ProviderEnum;
  @BeforeInsert()
  async hashPassword() {
    if (this.provider === 'local') {
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
    }
  }

  async checkPassword(aPassword: string) {
    const isMatched = await bcrypt.compare(aPassword, this.password);
    if (!isMatched)
      throw new HttpException('UNMATCHED', HttpStatus.BAD_REQUEST);
    return isMatched;
  }
}
