import { User, Couple, Task, Notification } from '../types';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-url.com/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/user');
  }

  async login(email: string, password: string): Promise<User> {
    return this.request<User>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/logout', { method: 'POST' });
  }

  // Couple endpoints
  async getCouple(): Promise<Couple & { spouse: User }> {
    return this.request<Couple & { spouse: User }>('/couple');
  }

  async createInviteCode(): Promise<{ inviteCode: string }> {
    return this.request<{ inviteCode: string }>('/couple/create', {
      method: 'POST',
    });
  }

  async joinCouple(inviteCode: string): Promise<Couple> {
    return this.request<Couple>('/couple/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  // Task endpoints
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async toggleTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.request<void>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async nudgeTask(taskId: string, message?: string): Promise<void> {
    return this.request<void>(`/tasks/${taskId}/nudge`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this.request<void>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);