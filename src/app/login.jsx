import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';

export default function LoginScreen() {
  const { loginUser } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Admin'

  const handleLogin = () => {
    // Basic Form Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    // Set role and authenticated user in shared state
    loginUser(role, email.trim());

    Alert.alert(
      'Sign In Successful',
      `Welcome to Finance Tracker! Logged in as ${role} (${email.trim()}).`,
      [
        {
          text: 'Continue to Dashboard',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.backText}>← Back to App</Text>
      </TouchableOpacity>

      {/* Header Logo */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>₹</Text>
        </View>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Secure Personal & Business Finance Management
        </Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        {/* Role Toggle Selector */}
        <Text style={styles.label}>Select Role *</Text>
        <View style={styles.roleRow}>
          {['Customer', 'Admin'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
              onPress={() => setRole(r)}
            >
              <Text
                style={[
                  styles.roleBtnText,
                  role === r && styles.roleBtnTextActive,
                ]}
              >
                {r === 'Admin' ? '👑 Admin' : '👤 Customer'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email Address */}
        <Text style={styles.label}>{role} Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder={
            role === 'Admin'
              ? 'Type admin email (e.g. admin@gmail.com)'
              : 'Type customer email (e.g. sivani@gmail.com)'
          }
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your password"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Sign In Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Sign In as {role}</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.signupText}>
            Don&apos;t have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  backText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0A192F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  logoText: {
    fontSize: 34,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  demoFillContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  demoBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  demoBtnTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
    marginTop: 12,
    marginBottom: 6,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  roleBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#0A192F',
  },
  loginBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 22,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 13,
    color: '#64748B',
  },
  signupHighlight: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  footerNote: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
  },
});
