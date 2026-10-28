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

export default function SignupScreen() {
  const { loginUser, addAdmin, registerCustomer } = useFinance();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Admin'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Form Validation
    if (!name.trim() || name.trim().length < 3) {
      Alert.alert('Validation Error', 'Full Name must be at least 3 characters long.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must have at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match. Please verify your password.');
      return;
    }

    // Record customer or admin in directory
    if (role === 'Admin') {
      addAdmin({
        name: name.trim(),
        email: email.trim(),
        roleTitle: 'Administrator',
        phone: phone.trim(),
      });
    } else {
      registerCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
    }

    // Success login
    loginUser(role, email.trim(), name.trim());

    Alert.alert(
      'Account Created Successfully',
      `Welcome ${name.trim()}!\nYour ${role} account has been created successfully.`,
      [
        {
          text: 'Go to Dashboard',
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
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>₹</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up for Finance Tracker (Admin & Customer)
        </Text>
      </View>

      <View style={styles.card}>
        {/* Role Selection */}
        <Text style={styles.label}>Register As *</Text>
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

        {/* Full Name */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sivani Murugesan"
          value={name}
          onChangeText={setName}
        />

        {/* Email Address */}
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. user@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Mobile Number */}
        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 9876543210"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Password */}
        <Text style={styles.label}>Password (minimum 6 characters) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Create secure password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupBtnText}>Create {role} Account</Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginHighlight}>Sign In</Text>
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
    marginBottom: 14,
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
    marginBottom: 18,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0A192F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  logoText: {
    fontSize: 30,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
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
    marginTop: 10,
    marginBottom: 5,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
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
    fontSize: 12,
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
    padding: 11,
    fontSize: 13,
    color: '#0A192F',
  },
  signupBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  signupBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 12,
    color: '#64748B',
  },
  loginHighlight: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
