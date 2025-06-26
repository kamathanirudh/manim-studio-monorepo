import { IsArray, IsString, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSceneDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  id?: string;
}

export class CreateAnimationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSceneDto)
  scenes!: CreateSceneDto[];
} 