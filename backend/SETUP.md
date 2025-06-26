# Backend Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=manim_studio

# Together AI API Key
TOGETHER_API_KEY=a59426f930d653cf73e3db3d0f94a027e0af25bb24ecd3f5eaf1c63784fed4fayour_together_api_key_here

# Server Configuration
PORT=3001
```

## Prerequisites

1. **PostgreSQL Database**: Install and set up PostgreSQL
2. **Manim**: Install Manim for video generation
   ```bash
   pip install manim
   ```
3. **Together AI API Key**: Get your API key from [Together AI](https://together.ai)

## Installation

```bash
npm install
```

## Running the Backend

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`

## API Endpoints

- `POST /animations` - Create a new animation
- `GET /animations` - Get all animations
- `GET /animations/:id` - Get a specific animation
- `GET /animations/:id/video` - Stream the generated video 