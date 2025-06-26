// API service for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Scene {
  id: string;
  content: string;
}

export interface Animation {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoPath?: string;
  scenes: Scene[];
  createdAt: string;
}

export interface CreateAnimationRequest {
  title: string;
  scenes: string[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all animations
  async getAnimations(): Promise<Animation[]> {
    return this.request<Animation[]>('/animations');
  }

  // Get a specific animation
  async getAnimation(id: string): Promise<Animation> {
    return this.request<Animation>(`/animations/${id}`);
  }

  // Create a new animation
  async createAnimation(data: CreateAnimationRequest): Promise<Animation> {
    return this.request<Animation>('/animations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/');
  }
}

// Create and export the API service instance
export const apiService = new ApiService(API_BASE_URL); 