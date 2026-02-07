import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input, Typography } from '../components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;

export default function CreateTaskScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (taskData: any) => apiClient.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create task');
    },
  });

  const handleCreateTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo: assignedTo || user?.id,
      createdBy: user?.id,
      completed: false,
    };

    createTaskMutation.mutate(taskData);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Create New Task
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          Add a new task for you or your partner
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details (optional)"
          multiline
        />

        <View style={styles.prioritySection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Priority
          </Typography>
          <View style={styles.priorityButtons}>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <Button
                key={p}
                title={p.charAt(0).toUpperCase() + p.slice(1)}
                onPress={() => setPriority(p)}
                variant={priority === p ? 'primary' : 'outline'}
                size="sm"
                style={styles.priorityButton}
              />
            ))}
          </View>
        </View>

        <Input
          label="Due Date"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD (optional)"
        />

        <View style={styles.actions}>
          <Button
            title="Create Task"
            onPress={handleCreateTask}
            loading={createTaskMutation.isPending}
            style={styles.createButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: '#92400E',
    marginBottom: 8,
  },
  subtitle: {
    color: '#78350F',
  },
  form: {
    marginBottom: 20,
  },
  prioritySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#92400E',
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
  },
  actions: {
    marginTop: 32,
  },
  createButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
});