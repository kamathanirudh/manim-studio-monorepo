import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animation } from './entities/animation.entity';
import { Scene } from './entities/scene.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(Animation)
    private animationRepository: Repository<Animation>,
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
  ) {}

  async onModuleInit() {
    await this.cleanupOnStartup();
  }

  private async cleanupOnStartup() {
    try {
      this.logger.log('Cleaning up backend data on startup...');
      
      // Clear all animations and scenes from database
      await this.sceneRepository.createQueryBuilder().delete().execute();
      await this.animationRepository.createQueryBuilder().delete().execute();
      
      // Clear all video files
      const videosDir = path.join(process.cwd(), 'videos');
      if (fs.existsSync(videosDir)) {
        const files = fs.readdirSync(videosDir);
        for (const file of files) {
          const filePath = path.join(videosDir, file);
          if (fs.statSync(filePath).isFile() && file.endsWith('.py')) {
            fs.unlinkSync(filePath);
            this.logger.log(`Deleted Python file: ${file}`);
          }
        }
        
        // Clear media directory
        const mediaDir = path.join(videosDir, 'media');
        if (fs.existsSync(mediaDir)) {
          fs.rmSync(mediaDir, { recursive: true, force: true });
          this.logger.log('Deleted media directory');
        }
      }
      
      this.logger.log('Backend cleanup completed successfully');
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
