import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';

export default function AuthGate({ screenTitle = 'This Section' }) {
  const { loginUser } = useFinance();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={styles.title}>Sign In Required</Text>
        <Text style={styles.screenTag}>{screenTitle}</Text>

        <Text style={styles.description}>
          Please sign in or create an account to view your private financial records,
          month-wise transactions, and real-time reports.
        </Text>

        {/* Go to Home Sign In button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>🔑 Go to Home Screen to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  lockIcon: {
    fontSize: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A192F',
    textAlign: 'center',
  },
  screenTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fastLoginLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  quickCustomerBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickCustomerText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quickAdminBtn: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickAdminText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
