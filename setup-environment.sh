#!/bin/bash

# Manim Studio - Environment Setup Script
# This script sets up the environment configuration for the backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env_file() {
    if [ -f "manim-studio-monorepo/backend/.env" ]; then
        print_warning ".env file already exists in backend directory"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Keeping existing .env file"
            return 0
        fi
    fi
    return 1
}

# Create .env file
create_env_file() {
    print_status "Creating .env file for backend..."
    
    cat > manim-studio-monorepo/backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=manim_studio

# Together AI API Key (you need to get this from https://together.ai)
TOGETHER_API_KEY=your_together_api_key_here

# Server Configuration
PORT=3001
EOF

    print_success ".env file created successfully!"
}

# Check PostgreSQL installation
check_postgres() {
    print_status "Checking PostgreSQL installation..."
    
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed!"
        print_status "Please install PostgreSQL first:"
        echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
        echo "  Arch Linux: sudo pacman -S postgresql"
        echo "  macOS: brew install postgresql"
        echo ""
        print_status "After installation, you'll need to:"
        echo "  1. Start PostgreSQL service"
        echo "  2. Create a database named 'manim_studio'"
        echo "  3. Update the .env file with your database credentials"
        return 1
    fi
    
    print_success "PostgreSQL is installed!"
    return 0
}

# Check Manim installation
check_manim() {
    print_status "Checking Manim installation..."
    
    if ! command -v manim &> /dev/null; then
        print_warning "Manim is not installed!"
        print_status "Installing Manim..."
        pip install manim
        
        if [ $? -eq 0 ]; then
            print_success "Manim installed successfully!"
        else
            print_error "Failed to install Manim!"
            print_status "You can install it manually with: pip install manim"
        fi
    else
        print_success "Manim is already installed!"
    fi
}

# Main execution
main() {
    echo "🔧 Setting up Manim Studio environment..."
    echo ""
    
    # Check PostgreSQL
    check_postgres
    
    # Check Manim
    check_manim
    
    # Create .env file if needed
    if check_env_file; then
        print_status "Environment file setup completed!"
    else
        create_env_file
    fi
    
    echo ""
    print_success "🎉 Environment setup completed!"
    echo ""
    print_status "Next steps:"
    echo "  1. Get your Together AI API key from https://together.ai"
    echo "  2. Update the TOGETHER_API_KEY in manim-studio-monorepo/backend/.env"
    echo "  3. Set up PostgreSQL database named 'manim_studio'"
    echo "  4. Run: ./install-dependencies.sh"
    echo "  5. Run: ./run-applications.sh"
    echo ""
    print_warning "Important: You must update the TOGETHER_API_KEY in the .env file!"
    print_warning "The backend will not work without a valid API key."
}

# Run main function
main "$@" 