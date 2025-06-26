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

    You are a **mathematically intelligent**, expert-level **Manim Community Edition** Python developer. You understand both **visual mathematics** and **formal animation principles**.
    
    You are powered by a highly capable **LLaMA-based large language model** with strong mathematical reasoning and symbolic manipulation abilities.
    
    Your task: Convert ALL scene descriptions below into a SINGLE continuous Manim animation. Combine them into ONE coherent, well-structured Python class named **Scene1**.
    
    ⚠️ CRITICAL INSTRUCTIONS:
    1. You will be given **multiple** scene descriptions.
    2. You MUST combine ALL of them into ONE continuous animation.
    3. DO NOT skip any scenes – every one MUST be included.
    4. Use Manim CE objects and methods that BEST represent the **mathematical intent**.
    5. Favor clear, intuitive mathematical animations. Animate ideas in a natural, continuous way.
    
    STRICT FORMAT REQUIREMENTS:
    - Start your output IMMEDIATELY with: \`from manim import *\`
    - Define a single class: \`class Scene1(Scene):\`
    - Use a \`construct(self):\` method to contain the ENTIRE animation
    - NO text, NO explanations, NO comments, NO markdown
    - ABSOLUTELY NO extra output except PURE executable Python code
    
    MANIM SYNTAX RULES (STRICTLY ENFORCED):
    - Imports: Always begin with \`from manim import *\`
    - Classes: Always \`class Scene1(Scene):\`
    - Text: Always use \`Text("symbol", font_size=, color=)\`, NEVER Tex()
    - Use Text() for ALL symbols: π, θ, ∑, ∫, ±, ∞, ≤, ≥, ≠, √, ², ³, etc.
    - Graphs: Use Axes, plot, plot_line_graph from Manim
    - Animations: Use self.play with run_time and rate_func where appropriate
    - Create objects, then animate with Transform, FadeIn, MoveTo, etc.
    - Always use self.wait() between sections to separate them
    
    MATHEMATICAL PRIORITY RULES:
    - When asked to animate equations or mathematical structures, interpret them with maximal mathematical clarity.
    - Use NumberPlane, Axes, and precise positioning for any geometry or graphs.
    - Maintain visual flow between scenes – position new elements relative to previous ones.
    - Label mathematical expressions with \`Text()\` using actual symbols like "∫", "π", "θ", etc., NOT LaTeX.
    
    POSITIONING:
    - Use ORIGIN, UP, DOWN, LEFT, RIGHT or np.array([x, y, z])
    - Move objects with \`.animate.move_to()\` or \`.shift()\`
    - For rotations and scaling, use \`.animate.rotate()\`, \`.scale()\`
    
    ANIMATION FLOW RULES:
    - You MUST combine all scene descriptions into ONE Scene1 class
    - Each scene description becomes a section in the same continuous animation
    - Between scenes, add \`self.wait(1)\` for pacing
    - Maintain visual continuity – fade out previous scene elements if necessary before transitioning
    
    OUTPUT RULES:
    ✅ DO respond with:
    - Only syntactically valid Python code
    - Starting with: \`from manim import *\`
    - A single class: \`Scene1(Scene)\`
    
    ❌ DO NOT include:
    - "Here's the code:"
    - "python"
    - Explanatory text before or after
    - Comments inside code
    - Any output EXCEPT executable code
    
    EXAMPLE FLOW:
    If given:
      - Scene 1: Draw a circle and rotate it
      - Scene 2: Transform it into a square and fade it out
    
    Then return:
    from manim import *
    
    class Scene1(Scene):
        def construct(self):
            circle = Circle(radius=1, color=BLUE)
            self.play(Create(circle))
            self.play(circle.animate.rotate(PI))
            self.wait()
            square = Square(side_length=2, color=RED)
            self.play(Transform(circle, square))
            self.play(FadeOut(square))
            self.wait()
    
    ⬇️⬇️⬇️ NOW BEGIN CODE GENERATION ⬇️⬇️⬇️
    
    SCENE DESCRIPTIONS:
    ${scenesDescription}
    `;
    

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
    // Since we now generate a single combined scene, always return Scene1
    return ['Scene1'];
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

      // Find the generated video file (we only have Scene1 now)
      const videoFile = this.findVideoFile(videosDir, 'Scene1');

      if (videoFile) {
        await this.animationRepository.update(animationId, {
          videoPath: videoFile,
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