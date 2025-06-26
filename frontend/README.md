# Manim Studio Backend

NestJS backend for the Manim Studio application. Handles animation and scene storage with PostgreSQL.

## Features

- Store animations and scenes separately in PostgreSQL
- RESTful API for animation management
- TypeScript with full type safety
- Automatic database schema synchronization

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   Create a PostgreSQL database named `manim_studio` and update the `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=manim_studio
   PORT=3001
   ```

3. **Run the application:**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Animations

- `POST /animations` - Create a new animation with scenes
- `GET /animations` - Get all animations
- `GET /animations/:id` - Get a specific animation with its scenes

### Example Request

```json
POST /animations
{
  "title": "My Animation",
  "scenes": [
    {
      "content": "Show a graph of sin(x) and highlight its maxima"
    },
    {
      "content": "Animate the transformation of a circle into an ellipse"
    }
  ]
}
```

## Database Schema

- **animations**: Stores animation metadata (id, title, status, videoPath, createdAt)
- **scenes**: Stores individual scenes (id, content, orderIndex, animationId)

Scenes are stored separately as requested, making it easy to feed them to LLMs later.

## Development

The backend runs on port 3001 by default and includes CORS configuration for the frontend running on port 3000. 