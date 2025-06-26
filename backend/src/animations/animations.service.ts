import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animation, AnimationStatus } from '../entities/animation.entity';
import { Scene } from '../entities/scene.entity';
import { CreateAnimationDto } from '../dto/create-animation.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

@Injectable()
export class AnimationsService {
  private readonly logger = new Logger(AnimationsService.name);

  constructor(
    @InjectRepository(Animation)
    private animationRepository: Repository<Animation>,
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
  ) {}

  async createAnimation(createAnimationDto: CreateAnimationDto): Promise<Animation> {
    const animation = this.animationRepository.create({
      title: createAnimationDto.title,
      status: AnimationStatus.PENDING,
    });

    const savedAnimation = await this.animationRepository.save(animation);

    // Save scenes
    const scenes = createAnimationDto.scenes.map((sceneContent, index) =>
      this.sceneRepository.create({
        content: sceneContent,
        orderIndex: index,
        animationId: savedAnimation.id,
      }),
    );

    await this.sceneRepository.save(scenes);

    // Start async processing (fire and forget)
    this.processAnimation(savedAnimation.id).catch(error => {
      this.logger.error(`Failed to process animation ${savedAnimation.id}:`, error);
    });

    // Return the animation with scenes included
    return this.findOne(savedAnimation.id) as Promise<Animation>;
  }

  async findAll(): Promise<Animation[]> {
    return this.animationRepository.find({
      relations: ['scenes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Animation | null> {
    return this.animationRepository.findOne({
      where: { id },
      relations: ['scenes'],
    });
  }

  private async processAnimation(animationId: string): Promise<void> {
    try {
      // Update status to processing
      await this.animationRepository.update(animationId, {
        status: AnimationStatus.PROCESSING,
      });

      const animation = await this.findOne(animationId);
      if (!animation) {
        throw new Error('Animation not found');
      }

      // Generate Manim code using LLM
      const manimCode = await this.generateManimCode(animation);
      
      // Save the generated code
      await this.animationRepository.update(animationId, {
        manimCode,
      });

      // Generate video file
      await this.generateVideo(animationId, manimCode);

      // Update status to completed after video generation
      await this.animationRepository.update(animationId, {
        status: AnimationStatus.COMPLETED,
      });

    } catch (error) {
      this.logger.error(`Error processing animation ${animationId}:`, error);
      await this.animationRepository.update(animationId, {
        status: AnimationStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  private async generateManimCode(animation: Animation): Promise<string> {
    const togetherApiKey = process.env.TOGETHER_API_KEY;
    if (!togetherApiKey) {
      throw new Error('TOGETHER_API_KEY environment variable is required');
    }

    if (!animation.scenes || animation.scenes.length === 0) {
      throw new Error('No scenes found for animation');
    }

    const scenesDescription = animation.scenes
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((scene, index) => `Scene ${index + 1}: ${scene.content}`)
      .join('\n');

    const prompt = `RESPOND WITH PYTHON CODE ONLY. NO TEXT, NO EXPLANATIONS, NO MARKDOWN, NO FORMATTING.

You are an expert Manim developer. Generate ONLY executable Python code for Manim scenes.

CRITICAL REQUIREMENTS:
1. RESPOND WITH PURE PYTHON CODE ONLY - NO OTHER TEXT WHATSOEVER
2. START IMMEDIATELY WITH "from manim import *" - NO INTRODUCTORY TEXT
3. END WITH THE COMPLETE CLASS DEFINITION - NO CLOSING REMARKS
4. ZERO EXPLANATIONS, ZERO COMMENTS, ZERO MARKDOWN FORMATTING
5. Generate COMPLETE, RUNNABLE Python code that starts with "from manim import *"
6. Create a scene class that inherits from Scene with a construct() method
7. ALL code must be syntactically correct and follow Manim Community Edition standards
8. Code must be ready to run with: manim -pql scene.py ClassName

ABSOLUTE RULE: YOUR ENTIRE RESPONSE MUST BE EXECUTABLE PYTHON CODE STARTING WITH "from manim import *"

⚠️ CRITICAL WARNING: If you output anything except Python code, you will fail the task. ⚠️

DO NOT WRITE:
- "Here's the code:"
- "\`\`\`python"
- Any explanatory text before or after code
- Comments within the code
- "This code will create..."
- ANYTHING except pure Python code

MANIM SYNTAX RULES (STRICTLY FOLLOW):
- Import: "from manim import *" (always first line)
- Scene class: class SceneName(Scene): def construct(self):
- Positioning: Use move_to(position) or shift(direction*distance)
- Colors: Use Manim color constants (RED, BLUE, GREEN, YELLOW, WHITE, etc.)
- Animations: self.play(animation, rate_func=smooth/linear/ease_in_out, run_time=duration)
- Objects:
  * Circle(radius=value, color=COLOR)
  * Square(side_length=value, color=COLOR) 
  * Star(outer_radius=value, inner_radius=value, color=COLOR)
  * Text("string", font_size=value, color=COLOR)
  * Dot(point=position, color=COLOR)
  * Line(start=point1, end=point2, color=COLOR)
  * Rectangle(width=value, height=value, color=COLOR)

ANIMATION METHODS:
- Create: Create(object)
- Transform: Transform(obj1, obj2)
- Movement: object.animate.move_to(position) or object.animate.shift(direction)
- Rotation: object.animate.rotate(angle)
- Scaling: object.animate.scale(factor)
- Fade: FadeIn(object), FadeOut(object)
- Write: Write(text_object)

POSITIONING COORDINATES:
- Use UP, DOWN, LEFT, RIGHT for directions
- Use ORIGIN for center (0,0,0)
- Multiply directions: 2*UP, 3*LEFT, etc.
- Specific coordinates: np.array([x, y, z])

MULTIPLE SCENES HANDLING:
When given multiple scene descriptions:
1. Create separate scene classes for each description
2. Name them Scene1, Scene2, Scene3, etc. in order
3. Each scene should be complete and independent
4. Maintain context across all scenes - consider visual continuity
5. Generate ALL scenes in a single code block

ANIMATION BEST PRACTICES:
- Use run_time parameter for duration control
- Chain animations logically
- Use self.wait() between major animation sequences
- Keep rate_func simple: smooth, linear, ease_in_out only
- Group related objects for simultaneous animations

FORBIDDEN ELEMENTS:
- No undefined rate functions or custom functions
- No external imports beyond "from manim import *"
- No explanatory text or comments in code
- No incomplete code blocks
- No syntax errors

OUTPUT FORMAT:
Your response must begin immediately with "from manim import *" and contain nothing else but executable Python code. No introductory phrases, no code blocks, no explanations.

EXAMPLE OF CORRECT RESPONSE FORMAT:
from manim import *

class Scene1(Scene):
    def construct(self):
        circle = Circle()
        self.play(Create(circle))

EXAMPLE OF INCORRECT RESPONSE (DO NOT DO THIS):
"Here's the Manim code you requested:"
\`\`\`python
from manim import *
...
\`\`\`

SCENE DESCRIPTIONS TO CONVERT:
${scenesDescription}`;

    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${togetherApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        },
      );

      // Validate response structure
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure from LLM API');
      }

      const generatedCode = response.data.choices[0].message.content;
      
      // Clean the generated code
      const cleanCode = this.cleanGeneratedCode(generatedCode);
      
      // Validate that we have valid Python code
      if (!cleanCode.includes('from manim import')) {
        throw new Error('Generated code does not contain valid Manim import');
      }
      
      return cleanCode;

    } catch (error) {
      if (error.response) {
        this.logger.error('LLM API Error:', error.response.data);
        throw new Error(`LLM API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        this.logger.error('Network Error:', error.message);
        throw new Error('Network error when calling LLM API');
      } else {
        this.logger.error('Error generating Manim code:', error);
        throw error;
      }
    }
  }

  private cleanGeneratedCode(generatedCode: string): string {
    let cleanCode = generatedCode;
    
    // Remove markdown code blocks if present (more flexible regex)
    const codeBlockPatterns = [
      /```python\s*\n([\s\S]*?)\n```/,
      /```\s*python\s*\n([\s\S]*?)\n```/,
      /```\s*\n([\s\S]*?)\n```/,
      /```([\s\S]*?)```/
    ];
    
    for (const pattern of codeBlockPatterns) {
      const match = cleanCode.match(pattern);
      if (match) {
        cleanCode = match[1];
        break;
      }
    }
    
    // Remove any explanatory text before the first import
    const importIndex = cleanCode.indexOf('from manim import');
    if (importIndex > 0) {
      cleanCode = cleanCode.substring(importIndex);
    }
    
    // Remove any text after the last meaningful line
    const lines = cleanCode.split('\n');
    let lastMeaningfulLine = lines.length - 1;
    
    // Find the last line that's not empty or just whitespace
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('"""') && !line.startsWith("'''")) {
        lastMeaningfulLine = i;
        break;
      }
    }
    
    cleanCode = lines.slice(0, lastMeaningfulLine + 1).join('\n');
    
    return cleanCode.trim();
  }

  private extractSceneNames(manimCode: string): string[] {
    const classRegex = /class\s+(\w+)\s*\(/g;
    const names: string[] = [];
    let match;
    while ((match = classRegex.exec(manimCode)) !== null) {
      names.push(match[1]);
    }
    return names.length > 0 ? names : ['Scene1'];
  }

  private async generateVideo(animationId: string, manimCode: string): Promise<void> {
    try {
      // Create videos directory if it doesn't exist
      const videosDir = path.join(process.cwd(), 'videos');
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      // Create Python file
      const fileName = `animation_${animationId}.py`;
      const filePath = path.join(videosDir, fileName);
      fs.writeFileSync(filePath, manimCode);

      // Update animation with file path
      await this.animationRepository.update(animationId, {
        manimFilePath: filePath,
      });

      // Run Manim once to render all scene classes in the file
      const command = `cd ${videosDir} && manim -pql -a ${fileName}`;
      this.logger.log(`Running command: ${command}`);
      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 minutes timeout
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      this.logger.log('Manim output:', stdout);
      if (stderr) {
        this.logger.warn('Manim stderr:', stderr);
      }

      // Optionally, find one of the generated video files to store in DB (e.g., the first one)
      // You may want to enhance this to store all video paths if needed
      const sceneNames = this.extractSceneNames(manimCode);
      let foundVideoFile: string | null = null;
      for (const sceneName of sceneNames) {
        const videoFile = this.findVideoFile(videosDir, sceneName);
        if (videoFile) {
          foundVideoFile = videoFile;
          break;
        }
      }

      if (foundVideoFile) {
        await this.animationRepository.update(animationId, {
          videoPath: foundVideoFile,
        });
      } else {
        throw new Error('Generated video file not found');
      }

    } catch (error) {
      this.logger.error('Error generating video:', error);
      throw error;
    }
  }

  private findVideoFile(videosDir: string, sceneName: string): string | null {
    // Look for the main video file in the media/videos structure
    const mediaPath = path.join(videosDir, 'media', 'videos');
    if (fs.existsSync(mediaPath)) {
      const videoDirs = fs.readdirSync(mediaPath);
      for (const dir of videoDirs) {
        const qualityDir = path.join(mediaPath, dir, '480p15');
        if (fs.existsSync(qualityDir)) {
          const videoFile = path.join(qualityDir, `${sceneName}.mp4`);
          if (fs.existsSync(videoFile)) {
            return videoFile;
          }
        }
      }
    }
    
    return null;
  }
}