import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { Button, Input, Typography, Card } from '../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface TaskCardProps {
  task: any;
  onToggle: (taskId: string) => void;
  onNudge: (taskId: string) => void;
}

function TaskCard({ task, onToggle, onNudge }: TaskCardProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Card style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Typography 
          variant="h3" 
          style={[
            styles.taskTitle, 
            task.completed && styles.completedTaskTitle
          ]}
        >
          {task.title}
        </Typography>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
      </View>
      
      {task.description && (
        <Typography variant="body" style={styles.taskDescription}>
          {task.description}
        </Typography>
      )}
      
      {task.dueDate && (
        <Typography variant="caption" style={styles.taskDueDate}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      )}
      
      <View style={styles.taskActions}>
        <Button
          title={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          onPress={() => onToggle(task.id)}
          variant="outline"
          size="sm"
        />
        {!task.completed && (
          <Button
            title="Nudge"
            onPress={() => onNudge(task.id)}
            variant="secondary"
            size="sm"
          />
        )}
      </View>
    </Card>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'my' | 'spouse'>('my');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.getTasks(),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId: string) => apiClient.toggleTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update task');
    },
  });

  const nudgeTaskMutation = useMutation({
    mutationFn: ({ taskId, message }: { taskId: string; message?: string }) => 
      apiClient.nudgeTask(taskId, message),
    onSuccess: () => {
      Alert.alert('Nudge Sent!', 'Your partner has been gently reminded.');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to send nudge');
    },
  });

  const myTasks = tasks.filter(task => task.assignedTo === user?.id);
  const spouseTasks = tasks.filter(task => task.assignedTo !== user?.id);

  const displayTasks = activeTab === 'my' ? myTasks : spouseTasks;

  const handleToggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleNudgeTask = (taskId: string) => {
    nudgeTaskMutation.mutate({ taskId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Honey-Do
        </Typography>
        <Button
          title="Create Task"
          onPress={() => navigation.navigate('CreateTask')}
          size="sm"
        />
      </View>

      <View style={styles.tabs}>
        <Button
          title="My Tasks"
          onPress={() => setActiveTab('my')}
          variant={activeTab === 'my' ? 'primary' : 'outline'}
          style={styles.tabButton}
        />
        <Button
          title="Partner's Tasks"
          onPress={() => setActiveTab('spouse')}
          variant={activeTab === 'spouse' ? 'primary' : 'outline'}
          style={styles.tabButton}
        />
      </View>

      <FlatList
        data={displayTasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggleTask}
            onNudge={handleNudgeTask}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Typography variant="h3" style={styles.emptyTitle}>
              No tasks yet
            </Typography>
            <Typography variant="body" style={styles.emptyDescription}>
              Create your first task to get started
            </Typography>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    color: '#92400E',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    color: '#1F2937',
    marginRight: 12,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskDescription: {
    color: '#6B7280',
    marginBottom: 8,
  },
  taskDueDate: {
    color: '#92400E',
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#92400E',
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#78350F',
    textAlign: 'center',
  },
});