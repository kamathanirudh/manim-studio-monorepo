# 🎬 Manim Studio - AI-Powered Mathematical Animation Generator

> **Status: Development Complete - Ready for Deployment**  
> *This project is currently in development and not yet deployed. Deployment link will be added once available.*

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎯 Overview

**Manim Studio** is a full-stack web application that generates mathematical animations using AI. Users can describe mathematical concepts in natural language, and the system automatically creates professional-quality animations using the Manim library. This project demonstrates advanced full-stack development skills, AI integration, and mathematical visualization capabilities.

### 🎨 What It Does
- **Natural Language Processing**: Converts plain English descriptions into mathematical animations
- **AI-Powered Generation**: Uses LLaMA-3.3-70B-Instruct-Turbo-Free for intelligent code generation
- **Real-time Rendering**: Generates high-quality mathematical animations on-demand
- **Multi-Scene Support**: Combines multiple scene descriptions into cohesive animations
- **Interactive Web Interface**: Modern, responsive UI for creating and viewing animations

### 🏆 Key Achievements
- **End-to-End Solution**: Complete pipeline from user input to video generation
- **AI Integration**: Sophisticated prompt engineering for reliable code generation
- **Performance Optimization**: Efficient video rendering and delivery
- **User Experience**: Intuitive interface with real-time feedback
- **Scalable Architecture**: Microservices design for future expansion

## ✨ Features

### 🎭 Animation Capabilities
- **Geometric Shapes**: Circles, squares, polygons, stars, and custom shapes
- **Mathematical Graphs**: Function plotting, coordinate systems, axes
- **Text and Symbols**: Unicode mathematical symbols (π, θ, ∑, ∫, etc.)
- **Transformations**: Scaling, rotation, translation, morphing
- **Animations**: Fade in/out, creation, movement, color changes
- **Multi-Scene Sequences**: Combine multiple animations into one video

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Real-time Feedback**: Live status updates during animation generation
- **Video Player**: Custom video player with controls and download functionality
- **Scene Management**: Add, edit, and organize multiple scenes
- **Progress Tracking**: Visual progress indicators for long operations

### 🔧 Technical Features
- **AI Code Generation**: Intelligent Manim code generation using LLaMA
- **Error Handling**: Robust error handling and user feedback
- **Video Processing**: Automatic video generation and optimization
- **Database Integration**: PostgreSQL for data persistence
- **API Design**: RESTful API with proper error handling

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (React 18)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **State Management**: React hooks and context
- **Build Tool**: Vite (via Next.js)

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **AI Integration**: Together AI (LLaMA-3.3-70B-Instruct-Turbo-Free)
- **Video Processing**: Manim Community Edition
- **Authentication**: JWT (ready for implementation)

### Infrastructure
- **Database**: PostgreSQL 15+
- **Package Manager**: npm/pnpm
- **Version Control**: Git
- **Development**: Hot reload with nodemon
- **Testing**: Jest (configured)

### External Services
- **AI Provider**: Together AI API
- **Video Rendering**: Manim CE
- **LaTeX Processing**: System LaTeX installation

## 🏗 Architecture

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │   PostgreSQL    │    │   Together AI   │
│   Scene Forms   │    │   Database      │    │   LLaMA API     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Video Player  │    │   Manim Engine  │    │   Video Files   │
│   Display       │    │   Code Gen      │    │   Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Input**: User describes mathematical concepts in natural language
2. **API Processing**: Backend receives scene descriptions via REST API
3. **AI Generation**: LLaMA model generates Manim Python code
4. **Code Execution**: Manim renders the animation to video files
5. **Video Delivery**: Generated videos are served to the frontend
6. **User Display**: Custom video player shows the final animation

### Database Schema
```sql
-- Animations table
CREATE TABLE animations (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    status ENUM('pending', 'processing', 'completed', 'failed'),
    videoPath VARCHAR(500),
    manimCode TEXT,
    manimFilePath VARCHAR(500),
    errorMessage TEXT,
    createdAt TIMESTAMP
);

-- Scenes table
CREATE TABLE scenes (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    orderIndex INTEGER,
    animationId UUID REFERENCES animations(id)
);
```

## 📋 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows with WSL
- **Node.js**: v18.0.0 or higher
- **Python**: 3.11+ with pip
- **PostgreSQL**: 15.0 or higher
- **Memory**: 8GB RAM minimum (16GB recommended for video processing)
- **Storage**: 10GB free space for dependencies and video files

### Required Software
- **Git**: For version control
- **LaTeX**: For mathematical symbol rendering
- **FFmpeg**: For video processing (usually included with Manim)
- **Build Tools**: C++ compiler for native dependencies

## 🚀 Installation

### Quick Start
```bash
# Clone the repository
git clone https://github.com/kamathanirudh/manim-studio-monorepo.git
cd manim-studio-monorepo

# Run the installation script
chmod +x install-dependencies.sh
./install-dependencies.sh

# Set up environment
chmod +x setup-environment.sh
./setup-environment.sh

# Start the applications
chmod +x run-applications.sh
./run-applications.sh
```

### Manual Installation

#### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Install Python dependencies
pip install manim

# Install LaTeX packages
sudo apt-get install texlive-full  # Ubuntu/Debian
# or
brew install mactex  # macOS
```

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Database Setup
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb manim_studio

# Run migrations (if using TypeORM migrations)
npm run migration:run
```

## ⚙️ Environment Setup

### Required Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=manim_studio

# AI Service
TOGETHER_API_KEY=your_together_ai_key

# Application
PORT=3001
NODE_ENV=development

# JWT (for future auth)
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application
NEXT_PUBLIC_APP_NAME=Manim Studio
```

### API Key Setup
1. **Together AI**: Sign up at [together.ai](https://together.ai)
2. **Get API Key**: Navigate to API Keys section
3. **Add to .env**: Set `TOGETHER_API_KEY=your_key_here`

## 🎮 Usage

### Creating Animations

#### 1. Access the Application
- Open your browser to `http://localhost:3000`
- You'll see the main animation creation interface

#### 2. Add Scene Descriptions
- Click "Add Scene" to add new scenes
- Describe your mathematical concept in natural language
- Examples:
  - "Create a blue circle and rotate it 360 degrees"
  - "Draw a red square and transform it into a triangle"
  - "Plot the function y = x² from -3 to 3"

#### 3. Generate Animation
- Click "Generate Animation" to start the process
- The system will:
  - Send descriptions to AI for code generation
  - Generate Manim Python code
  - Render the animation to video
  - Display the result in the video player

#### 4. View and Download
- Watch the generated animation in the custom video player
- Download the video file for offline use
- Edit scenes and regenerate if needed

### Example Animations

#### Basic Geometry
```
Scene 1: Create a blue circle
Scene 2: Transform it into a red square
Scene 3: Move the square to the top of the screen
```

#### Mathematical Functions
```
Scene 1: Plot the function y = x²
Scene 2: Add the function y = x³ in a different color
Scene 3: Show the intersection points
```

#### Complex Animations
```
Scene 1: Create a star and make it spin
Scene 2: Fade out the star
Scene 3: Draw a coordinate system
Scene 4: Plot the sine wave function
```

## 📚 API Documentation

### Endpoints

#### Create Animation
```http
POST /animations
Content-Type: application/json

{
  "title": "My Animation",
  "scenes": [
    {
      "content": "Create a blue circle",
      "orderIndex": 0
    },
    {
      "content": "Transform it to a square",
      "orderIndex": 1
    }
  ]
}
```

#### Get Animation
```http
GET /animations/:id
```

#### Get All Animations
```http
GET /animations
```

#### Get Video File
```http
GET /animations/:id/video
```

### Response Format
```json
{
  "id": "uuid",
  "title": "Animation Title",
  "status": "completed",
  "videoPath": "/path/to/video.mp4",
  "manimCode": "from manim import *\n...",
  "createdAt": "2024-01-01T00:00:00Z",
  "scenes": [
    {
      "id": "uuid",
      "content": "Scene description",
      "orderIndex": 0
    }
  ]
}
```

## 📁 Project Structure

```
manim-studio-monorepo/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── animations/              # Animation module
│   │   │   ├── animations.controller.ts
│   │   │   ├── animations.service.ts
│   │   │   └── animations.module.ts
│   │   ├── entities/                # Database entities
│   │   │   ├── animation.entity.ts
│   │   │   └── scene.entity.ts
│   │   ├── dto/                     # Data transfer objects
│   │   │   └── create-animation.dto.ts
│   │   ├── app.controller.ts        # Main controller
│   │   ├── app.service.ts           # Main service
│   │   ├── app.module.ts            # Root module
│   │   └── main.ts                  # Application entry
│   ├── videos/                      # Generated videos
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/                        # Next.js Frontend
│   ├── app/                         # App router pages
│   │   ├── page.tsx                 # Main page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── SceneInput.tsx           # Scene input component
│   │   ├── SceneManager.tsx         # Scene management
│   │   ├── VideoPlayer.tsx          # Custom video player
│   │   └── SubmitButton.tsx         # Submit button
│   ├── lib/                         # Utility libraries
│   │   ├── api.ts                   # API client
│   │   └── utils.ts                 # Utility functions
│   ├── hooks/                       # Custom React hooks
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
├── install-dependencies.sh          # Installation script
├── run-applications.sh              # Startup script
├── setup-environment.sh             # Environment setup
├── test-video.html                  # Video test file
└── README.md                        # This file
```

## 🔧 Development

### Development Workflow

#### 1. Backend Development
```bash
cd backend

# Start in development mode
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

#### 2. Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### 3. Database Development
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Code Quality

#### Backend
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Type Safety**: Strict TypeScript configuration
- **Testing**: Jest with supertest for API testing

#### Frontend
- **Linting**: ESLint with Next.js rules
- **Formatting**: Prettier
- **Type Safety**: Strict TypeScript configuration
- **Component Library**: shadcn/ui for consistent design

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
cd frontend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Manual Testing
1. **Video Generation**: Test various scene descriptions
2. **Error Handling**: Test invalid inputs and API failures
3. **Performance**: Test with multiple concurrent requests
4. **UI/UX**: Test responsive design and accessibility

## 🚀 Deployment

### Production Setup

#### 1. Environment Configuration
```bash
# Set production environment variables
NODE_ENV=production
DATABASE_URL=your_production_db_url
TOGETHER_API_KEY=your_production_api_key
```

#### 2. Database Setup
```bash
# Run migrations
npm run migration:run

# Seed initial data (if needed)
npm run seed
```

#### 3. Build and Deploy
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Deployment Options

#### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

#### Cloud Deployment
- **Vercel**: Frontend deployment
- **Railway**: Backend deployment
- **Supabase**: Database hosting
- **AWS/GCP**: Full infrastructure

### Performance Optimization
- **Caching**: Redis for API responses
- **CDN**: CloudFlare for video delivery
- **Load Balancing**: Multiple backend instances
- **Database**: Connection pooling and indexing

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Add tests
6. Submit a pull request

### Contribution Guidelines
- **Code Style**: Follow existing patterns
- **Testing**: Add tests for new features
- **Documentation**: Update docs for API changes
- **Commits**: Use conventional commit messages

### Code Review Process
1. **Automated Checks**: CI/CD pipeline validation
2. **Code Review**: At least one approval required
3. **Testing**: All tests must pass
4. **Documentation**: Docs updated if needed

## 🔮 Future Enhancements

### Planned Features
- **User Authentication**: JWT-based auth system
- **User Profiles**: Save and share animations
- **Animation Templates**: Pre-built animation templates
- **Collaboration**: Real-time collaborative editing
- **Advanced AI**: More sophisticated prompt engineering
- **Mobile App**: React Native mobile application

### Technical Improvements
- **Performance**: Video caching and optimization
- **Scalability**: Microservices architecture
- **Monitoring**: Application performance monitoring
- **Analytics**: User behavior tracking
- **Security**: Enhanced security measures

### AI Enhancements
- **Better Prompts**: Improved prompt engineering
- **Custom Models**: Fine-tuned models for specific domains
- **Multi-language**: Support for multiple languages
- **Voice Input**: Speech-to-text for scene descriptions

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Port already in use
lsof -ti:3001 | xargs kill -9

# Database connection failed
sudo systemctl start postgresql

# Manim installation issues
pip install --upgrade manim
```

#### Frontend Issues
```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Build errors
npm run build --verbose
```

#### Video Generation Issues
```bash
# LaTeX not found
sudo apt-get install texlive-full

# FFmpeg issues
sudo apt-get install ffmpeg

# Memory issues
# Increase system memory or optimize video settings
```

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run start:dev

# Frontend debug
NODE_ENV=development npm run dev
```

### Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nirudh Kamath**
- GitHub: [@kamathanirudh](https://github.com/kamathanirudh)
- LinkedIn: [Nirudh Kamath](https://linkedin.com/in/nirudh-kamath)
- Portfolio: [nirudh.dev](https://nirudh.dev) *(if available)*

## 🙏 Acknowledgments

- **Manim Community**: For the amazing mathematical animation library
- **Together AI**: For providing the LLaMA API
- **NestJS Team**: For the excellent backend framework
- **Next.js Team**: For the powerful React framework
- **shadcn/ui**: For the beautiful component library

## 📞 Support

For support, please open an issue on GitHub or contact:
- **Email**: nirudh@example.com *(replace with actual email)*
- **Discord**: [Manim Studio Community](https://discord.gg/manim-studio) *(if available)*

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

*This project demonstrates advanced full-stack development skills, AI integration, and mathematical visualization capabilities. Perfect for showcasing technical expertise to potential employers.* 