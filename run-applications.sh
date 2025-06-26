#!/bin/bash

# Manim Studio - Application Runner Script
# This script runs both frontend and backend applications

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_frontend() {
    echo -e "${CYAN}[FRONTEND]${NC} $1"
}

print_backend() {
    echo -e "${YELLOW}[BACKEND]${NC} $1"
}

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down applications..."
    
    # Kill background processes
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend process stopped"
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend process stopped"
    fi
    
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

# Check if dependencies are installed
check_dependencies() {
    print_status "Checking if dependencies are installed..."
    
    # Check frontend node_modules
    if [ ! -d "manim-studio-monorepo/frontend/node_modules" ]; then
        print_warning "Frontend dependencies not found. Installing..."
        cd manim-studio-monorepo/frontend
        npm install
        cd ../..
    fi
    
    # Check backend node_modules
    if [ ! -d "manim-studio-monorepo/backend/node_modules" ]; then
        print_warning "Backend dependencies not found. Installing..."
        cd manim-studio-monorepo/backend
        npm install
        cd ../..
    fi
    
    print_success "Dependencies check completed!"
}

# Run frontend
run_frontend() {
    print_status "Starting frontend application..."
    
    cd manim-studio-monorepo/frontend
    
    # Start frontend in background
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    print_frontend "Started with PID: $FRONTEND_PID"
    print_frontend "Logs: manim-studio-monorepo/frontend.log"
    
    cd ../..
}

# Run backend
run_backend() {
    print_status "Starting backend application..."
    
    cd manim-studio-monorepo/backend
    
    # Start backend in background
    npm run start:dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    print_backend "Started with PID: $BACKEND_PID"
    print_backend "Logs: manim-studio-monorepo/backend.log"
    
    cd ../..
}

# Wait for applications to start
wait_for_startup() {
    print_status "Waiting for applications to start..."
    
    # Wait a bit for processes to start
    sleep 3
    
    # Check if processes are still running
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend is running!"
    else
        print_error "Frontend failed to start. Check frontend.log for details."
        exit 1
    fi
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend is running!"
    else
        print_error "Backend failed to start. Check backend.log for details."
        exit 1
    fi
}

# Show application status
show_status() {
    echo ""
    print_success "🎉 Both applications are now running!"
    echo ""
    echo -e "${CYAN}Frontend:${NC}"
    echo "  URL: http://localhost:3000"
    echo "  PID: $FRONTEND_PID"
    echo "  Logs: manim-studio-monorepo/frontend.log"
    echo ""
    echo -e "${YELLOW}Backend:${NC}"
    echo "  URL: http://localhost:3001"
    echo "  PID: $BACKEND_PID"
    echo "  Logs: manim-studio-monorepo/backend.log"
    echo ""
    print_status "Press Ctrl+C to stop both applications"
    echo ""
}

# Monitor applications
monitor_applications() {
    while true; do
        # Check if frontend is still running
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            print_error "Frontend process died unexpectedly!"
            cleanup
            exit 1
        fi
        
        # Check if backend is still running
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            print_error "Backend process died unexpectedly!"
            cleanup
            exit 1
        fi
        
        sleep 5
    done
}

# Main execution
main() {
    echo "🚀 Starting Manim Studio applications..."
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Start applications
    run_frontend
    run_backend
    
    # Wait for startup
    wait_for_startup
    
    # Show status
    show_status
    
    # Monitor applications
    monitor_applications
}

# Run main function
main "$@" 