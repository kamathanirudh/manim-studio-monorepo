import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimationsModule } from './animations/animations.module';
import { Animation } from './entities/animation.entity';
import { Scene } from './entities/scene.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'manim_studio',
      entities: [Animation, Scene],
      synchronize: true, // Only for development
      logging: true,
    }),
    TypeOrmModule.forFeature([Animation, Scene]),
    AnimationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
