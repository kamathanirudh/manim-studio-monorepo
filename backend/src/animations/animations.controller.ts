import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AnimationsService } from './animations.service';
import { CreateAnimationDto } from '../dto/create-animation.dto';
import { Animation } from '../entities/animation.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('animations')
export class AnimationsController {
  constructor(private readonly animationsService: AnimationsService) {}

  @Post()
  async create(@Body() createAnimationDto: CreateAnimationDto): Promise<Animation> {
    return this.animationsService.createAnimation(createAnimationDto);
  }

  @Get()
  async findAll(): Promise<Animation[]> {
    return this.animationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Animation> {
    const animation = await this.animationsService.findOne(id);
    if (!animation) {
      throw new Error('Animation not found');
    }
    return animation;
  }

  @Get(':id/video')
  async getVideo(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const animation = await this.animationsService.findOne(id);
    
    if (!animation || !animation.videoPath) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    const videoPath = animation.videoPath;
    
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ message: 'Video file not found' });
      return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = res.req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  }
} 