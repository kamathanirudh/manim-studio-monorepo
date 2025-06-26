# Manim Studio

A full-stack application for creating mathematical animations using Manim, with a React frontend and NestJS backend.

## 🚀 Quick Start

### 1. Setup Environment
```bash
./setup-environment.sh
```

### 2. Install Dependencies
```bash
./install-dependencies.sh
```

### 3. Run Applications
```bash
./run-applications.sh
```

## 📁 Project Structure

```
manim-studio-3/
├── manim-studio-monorepo/
│   ├── frontend/                 # Next.js React frontend
│   │   ├── app/                 # Next.js app directory
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities and API service
│   │   └── src/                 # NestJS backend (confusing, I know!)
│   └── backend/                 # Main NestJS backend
├── install-dependencies.sh      # Install all dependencies
├── run-applications.sh          # Run both frontend and backend
└── setup-environment.sh         # Setup environment configuration
```

## 🔧 Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Python** with pip
- **Manim** (will be installed automatically)

### Required API Keys
- **Together AI API Key** - Get from [https://together.ai](https://together.ai)

## 🛠️ Manual Setup

### 1. Environment Configuration

Create `.env` file in `manim-studio-monorepo/backend/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=manim_studio

# Together AI API Key
TOGETHER_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3001
```

### 2. Database Setup

```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb manim_studio
```

### 3. Install Dependencies

```bash
# Frontend dependencies
cd manim-studio-monorepo/frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 4. Run Applications

**Terminal 1 - Frontend:**
```bash
cd manim-studio-monorepo/frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd manim-studio-monorepo/backend
npm run start:dev
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔌 API Endpoints

### Animations
- `POST /animations` - Create new animation
- `GET /animations` - Get all animations
- `GET /animations/:id` - Get specific animation
- `GET /animations/:id/video` - Get animation video

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

## 🐛 Troubleshooting

### Frontend and Backend Not Connecting

1. **Check if backend is running:**
   ```bash
   curl http://localhost:3001
   ```

2. **Check environment variables:**
   - Ensure `.env` file exists in backend directory
   - Verify `TOGETHER_API_KEY` is set correctly

3. **Check database connection:**
   - Ensure PostgreSQL is running
   - Verify database `manim_studio` exists
   - Check database credentials in `.env`

4. **Check logs:**
   - Frontend logs: `manim-studio-monorepo/frontend.log`
   - Backend logs: `manim-studio-monorepo/backend.log`

### Common Issues

**Error: "TOGETHER_API_KEY environment variable is required"**
- Get API key from [https://together.ai](https://together.ai)
- Update `.env` file with your key

**Error: "Database connection failed"**
- Ensure PostgreSQL is running
- Check database credentials
- Create database: `sudo -u postgres createdb manim_studio`

**Error: "Manim not found"**
- Install Manim: `pip install manim`
- Ensure Python is in your PATH

## 📝 Development

### Frontend Development
- Built with Next.js 15 and React 18
- Uses Tailwind CSS for styling
- TypeScript for type safety

### Backend Development
- Built with NestJS
- PostgreSQL database with TypeORM
- Together AI integration for LLM-powered code generation

### Architecture
- **Frontend**: React SPA that communicates with backend API
- **Backend**: RESTful API that generates Manim code and videos
- **Database**: PostgreSQL stores animations and scenes
- **AI**: Together AI generates Manim code from scene descriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 