import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animation, AnimationStatus } from '../entities/animation.entity';
import { Scene } from '../entities/scene.entity';
import { CreateAnimationDto } from '../dto/create-animation.dto';

@Injectable()
export class AnimationsService {
  constructor(
    @InjectRepository(Animation)
    private animationRepository: Repository<Animation>,
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
  ) {}

  async createAnimation(createAnimationDto: CreateAnimationDto): Promise<Animation> {
    const { title, scenes } = createAnimationDto;

    // Create animation
    const animation = this.animationRepository.create({
      title: title || `Animation ${new Date().toISOString()}`,
      status: AnimationStatus.PENDING,
    });

    const savedAnimation = await this.animationRepository.save(animation);

    // Create scenes
    const sceneEntities = scenes.map((sceneDto, index) =>
      this.sceneRepository.create({
        content: sceneDto.content,
        orderIndex: index + 1,
        animationId: savedAnimation.id,
      }),
    );

    await this.sceneRepository.save(sceneEntities);

    // Return animation with scenes
    return this.findOne(savedAnimation.id);
  }

  async findAll(): Promise<Animation[]> {
    return this.animationRepository.find({
      relations: ['scenes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Animation> {
    const animation = await this.animationRepository.findOne({
      where: { id },
      relations: ['scenes'],
      order: { scenes: { orderIndex: 'ASC' } },
    });

    if (!animation) {
      throw new Error('Animation not found');
    }

    return animation;
  }

  async updateStatus(id: string, status: AnimationStatus, videoPath?: string): Promise<Animation> {
    const animation = await this.findOne(id);
    animation.status = status;
    if (videoPath) {
      animation.videoPath = videoPath;
    }
    return this.animationRepository.save(animation);
  }
} 