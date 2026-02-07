import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Typography, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          Honey-Do
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          The sweet way to share tasks with your partner
        </Typography>
      </View>

      <View style={styles.illustration}>
        <View style={styles.heartIcon}>
          <Text style={styles.heartText}>🍯</Text>
        </View>
      </View>

      <View style={styles.features}>
        <Card style={styles.featureCard}>
          <Typography variant="h3" style={styles.featureTitle}>
            Share Tasks
          </Typography>
          <Typography variant="body" style={styles.featureDescription}>
            Create and assign tasks between you and your partner
          </Typography>
        </Card>

        <Card style={styles.featureCard}>
          <Typography variant="h3" style={styles.featureTitle}>
            Gentle Reminders
          </Typography>
          <Typography variant="body" style={styles.featureDescription}>
            Send sweet nudges instead of nagging
          </Typography>
        </Card>

        <Card style={styles.featureCard}>
          <Typography variant="h3" style={styles.featureTitle}>
            Track Progress
          </Typography>
          <Typography variant="body" style={styles.featureDescription}>
            See completed tasks and celebrate achievements together
          </Typography>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('Login')}
          size="lg"
          style={styles.button}
        />
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
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#78350F',
    textAlign: 'center',
    fontSize: 18,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    fontSize: 60,
  },
  features: {
    marginBottom: 40,
  },
  featureCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  featureTitle: {
    color: '#92400E',
    marginBottom: 8,
  },
  featureDescription: {
    color: '#6B7280',
    lineHeight: 22,
  },
  actions: {
    marginTop: 20,
  },
  button: {
    marginBottom: 16,
  },
});