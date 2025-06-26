import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateAnimationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  scenes: string[];
} 