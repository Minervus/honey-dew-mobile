import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input, Typography } from '../components';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the AuthProvider/AppNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Welcome Back
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          Sign in to continue sharing tasks with your partner
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />
      </View>

      <View style={styles.footer}>
        <Typography variant="body" style={styles.footerText}>
          Don't have an account? Sign up would go here
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
    fontSize: 16,
  },
  form: {
    marginBottom: 40,
  },
  loginButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#78350F',
    textAlign: 'center',
  },
});