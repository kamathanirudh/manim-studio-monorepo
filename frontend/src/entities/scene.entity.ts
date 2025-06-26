import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Animation } from './animation.entity';

@Entity('scenes')
export class Scene {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int' })
  orderIndex!: number;

  @Column({ type: 'uuid' })
  animationId!: string;

  @ManyToOne(() => Animation, (animation: Animation) => animation.scenes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animationId' })
  animation!: Animation;
} 