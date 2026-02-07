export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Couple {
  id: string;
  inviteCode: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Nudge {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'nudge' | 'task_completed' | 'task_assigned';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}