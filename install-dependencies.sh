#!/bin/bash

# Manim Studio - Dependency Installation Script
# This script installs all dependencies for both frontend and backend

set -e  # Exit on any error

echo "🚀 Starting Manim Studio dependency installation..."

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

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        print_status "You can download it from: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    
    if [ ! -d "manim-studio-monorepo/frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    cd manim-studio-monorepo/frontend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory!"
        exit 1
    fi
    
    # Install dependencies
    print_status "Running npm install for frontend..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully!"
    else
        print_error "Failed to install frontend dependencies!"
        exit 1
    fi
    
    cd ../..
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    
    if [ ! -d "manim-studio-monorepo/backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
    
    cd manim-studio-monorepo/backend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in backend directory!"
        exit 1
    fi
    
    # Install dependencies
    print_status "Running npm install for backend..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully!"
    else
        print_error "Failed to install backend dependencies!"
        exit 1
    fi
    
    cd ../..
}

# Main execution
main() {
    print_status "Checking prerequisites..."
    check_node
    check_npm
    
    print_status "Starting dependency installation..."
    
    # Install frontend dependencies
    install_frontend
    
    # Install backend dependencies
    install_backend
    
    print_success "🎉 All dependencies installed successfully!"
    print_status "You can now run the applications:"
    echo ""
    echo "  Frontend:"
    echo "    cd manim-studio-monorepo/frontend"
    echo "    npm run dev"
    echo ""
    echo "  Backend:"
    echo "    cd manim-studio-monorepo/backend"
    echo "    npm run start:dev"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@" 