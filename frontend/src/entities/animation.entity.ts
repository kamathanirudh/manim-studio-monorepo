import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Scene } from './scene.entity';

export enum AnimationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('animations')
export class Animation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({
    type: 'enum',
    enum: AnimationStatus,
    default: AnimationStatus.PENDING,
  })
  status: AnimationStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Scene, (scene) => scene.animation, { cascade: true })
  scenes: Scene[];
} 