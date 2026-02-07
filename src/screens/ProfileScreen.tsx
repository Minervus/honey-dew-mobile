import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Typography, Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Typography variant="h2" style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Typography>
        </View>
        <Typography variant="h2" style={styles.name}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="body" style={styles.email}>
          {user?.email}
        </Typography>
      </View>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <Typography variant="h3" style={styles.statNumber}>
            12
          </Typography>
          <Typography variant="body" style={styles.statLabel}>
            Tasks Completed
          </Typography>
        </Card>

        <Card style={styles.statCard}>
          <Typography variant="h3" style={styles.statNumber}>
            3
          </Typography>
          <Typography variant="body" style={styles.statLabel}>
            Tasks This Week
          </Typography>
        </Card>
      </View>

      <View style={styles.menu}>
        <Card style={styles.menuItem}>
          <Typography variant="h3" style={styles.menuItemText}>
            Couple Settings
          </Typography>
        </Card>

        <Card style={styles.menuItem}>
          <Typography variant="h3" style={styles.menuItemText}>
            Notifications
          </Typography>
        </Card>

        <Card style={styles.menuItem}>
          <Typography variant="h3" style={styles.menuItemText}>
            About
          </Typography>
        </Card>

        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
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
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
  },
  name: {
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    color: '#78350F',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statNumber: {
    color: '#92400E',
    marginBottom: 4,
  },
  statLabel: {
    color: '#78350F',
    textAlign: 'center',
  },
  menu: {
    marginBottom: 20,
  },
  menuItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  menuItemText: {
    color: '#1F2937',
  },
  logoutButton: {
    marginTop: 20,
  },
});