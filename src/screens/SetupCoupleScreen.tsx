import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input, Typography, Card } from '../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SetupCouple'>;

export default function SetupCoupleScreen({ navigation }: Props) {
  const [inviteCode, setInviteCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: couple } = useQuery({
    queryKey: ['couple'],
    queryFn: () => apiClient.getCouple(),
    retry: false,
  });

  const createInviteMutation = useMutation({
    mutationFn: () => apiClient.createInviteCode(),
    onSuccess: (data) => {
      Alert.alert(
        'Invite Code Created',
        `Share this code with your partner: ${data.inviteCode}`,
        [{ text: 'OK' }]
      );
      queryClient.invalidateQueries({ queryKey: ['couple'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create invite code');
    },
  });

  const joinCoupleMutation = useMutation({
    mutationFn: (code: string) => apiClient.joinCouple(code),
    onSuccess: () => {
      Alert.alert('Success', 'You have joined your couple successfully!');
      queryClient.invalidateQueries({ queryKey: ['couple'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to join couple');
    },
  });

  const handleCreateInvite = () => {
    createInviteMutation.mutate();
  };

  const handleJoinCouple = () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }
    joinCoupleMutation.mutate(inviteCode.trim().toUpperCase());
  };

  if (couple) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            You're Connected!
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            You are paired with {couple.spouse?.name}
          </Typography>
        </View>

        <Card style={styles.statusCard}>
          <Typography variant="h3" style={styles.statusText}>
            🎉 Partnership Active
          </Typography>
          <Typography variant="body" style={styles.statusDescription}>
            You can now create and share tasks with your partner
          </Typography>
        </Card>

        <Button
          title="Go to Tasks"
          onPress={() => navigation.goBack()}
          style={styles.continueButton}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Connect with Your Partner
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          Create an invite code or join your partner
        </Typography>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleButtons}>
          <Button
            title={!isCreating ? 'Create Invite' : 'Join Couple'}
            onPress={() => setIsCreating(!isCreating)}
            variant="primary"
            style={styles.toggleButton}
          />
        </View>
      </View>

      {isCreating ? (
        <View style={styles.section}>
          <Card style={styles.createCard}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Create Invite Code
            </Typography>
            <Typography variant="body" style={styles.sectionDescription}>
              Generate a code to share with your partner
            </Typography>
            <Button
              title="Generate Invite Code"
              onPress={handleCreateInvite}
              loading={createInviteMutation.isPending}
              style={styles.actionButton}
            />
          </Card>
        </View>
      ) : (
        <View style={styles.section}>
          <Card style={styles.joinCard}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Join with Code
            </Typography>
            <Typography variant="body" style={styles.sectionDescription}>
              Enter the invite code from your partner
            </Typography>
            <Input
              label="Invite Code"
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Enter 6-character code"
              autoCapitalize="characters"
              textAlign="center"
              style={styles.codeInput}
            />
            <Button
              title="Join Couple"
              onPress={handleJoinCouple}
              loading={joinCoupleMutation.isPending}
              style={styles.actionButton}
            />
          </Card>
        </View>
      )}

      <View style={styles.infoSection}>
        <Typography variant="caption" style={styles.infoText}>
          Invite codes are 6 characters long and not case-sensitive
        </Typography>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#78350F',
    textAlign: 'center',
  },
  toggleContainer: {
    marginBottom: 32,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  createCard: {
    padding: 20,
  },
  joinCard: {
    padding: 20,
  },
  sectionTitle: {
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeInput: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  statusCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  statusText: {
    color: '#059669',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusDescription: {
    color: '#6B7280',
    textAlign: 'center',
  },
  continueButton: {
    marginBottom: 20,
  },
  infoSection: {
    alignItems: 'center',
  },
  infoText: {
    color: '#78350F',
    textAlign: 'center',
  },
});