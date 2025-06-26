import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimationsController } from './animations.controller';
import { AnimationsService } from './animations.service';
import { Animation } from '../entities/animation.entity';
import { Scene } from '../entities/scene.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animation, Scene])],
  controllers: [AnimationsController],
  providers: [AnimationsService],
  exports: [AnimationsService],
})
export class AnimationsModule {} 