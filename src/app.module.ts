import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DblistModule } from './dblist/dblist.module';
import { AuthModule } from './auth/auth.module';
import { AppconfigModule } from './config/Appconfig.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { PostModule } from './post/post.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [UserModule, DblistModule, AuthModule, AppconfigModule, EmailModule, RedisModule, PostModule, MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
