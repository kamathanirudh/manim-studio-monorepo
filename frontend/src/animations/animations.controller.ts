import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AnimationsService } from './animations.service';
import { CreateAnimationDto } from '../dto/create-animation.dto';
import { Animation } from '../entities/animation.entity';

@Controller('animations')
export class AnimationsController {
  constructor(private readonly animationsService: AnimationsService) {}

  @Post()
  async create(@Body() createAnimationDto: CreateAnimationDto): Promise<Animation> {
    try {
      return await this.animationsService.createAnimation(createAnimationDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create animation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Animation[]> {
    try {
      return await this.animationsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch animations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Animation> {
    try {
      return await this.animationsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        'Animation not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
} 