import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { storage } from '../services/storage';
import { Task, Notification as AppNotification } from '../types';

interface WebSocketMessage {
  type: 'task_updated' | 'task_created' | 'nudge_sent' | 'notification';
  data: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private queryClient: any = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.setupNotifications();
  }

  setQueryClient(queryClient: any) {
    this.queryClient = queryClient;
  }

  private setupNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const token = await storage.getToken();

    if (!token) {
      this.isConnecting = false;
      return;
    }

    try {
      const wsUrl = __DEV__ 
        ? `ws://localhost:3000/ws?token=${token}`
        : `wss://your-production-url.com/ws?token=${token}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private async handleMessage(message: WebSocketMessage) {
    const { type, data } = message;

    switch (type) {
      case 'task_updated':
        this.queryClient?.invalidateQueries({ queryKey: ['tasks'] });
        this.emit('task_updated', data);
        break;

      case 'task_created':
        this.queryClient?.invalidateQueries({ queryKey: ['tasks'] });
        this.emit('task_created', data);
        await this.showNotification('New Task', data.title);
        break;

      case 'nudge_sent':
        this.queryClient?.invalidateQueries({ queryKey: ['notifications'] });
        this.emit('nudge_sent', data);
        await this.showNotification('Nudge!', data.message || 'Your partner is nudging you about a task');
        break;

      case 'notification':
        this.queryClient?.invalidateQueries({ queryKey: ['notifications'] });
        this.emit('notification', data);
        await this.showNotification(data.title, data.message);
        break;
    }
  }

  private async showNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Event listener system
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Send messages to server
  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }
}

// Hook for using WebSocket in components
export function useWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocketService();
      wsRef.current.setQueryClient(queryClient);
      wsRef.current.connect();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [queryClient]);

  return wsRef.current;
}

export const wsService = new WebSocketService();