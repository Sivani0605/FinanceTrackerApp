import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import ScreenHeader from '@/components/ScreenHeader';

export default function CustomerOnlyGate({ screenTitle = 'Customer Portal' }) {
  const { user, toggleRole } = useFinance();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={screenTitle}
        subtitle="Customer Access Only"
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔒</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>CUSTOMER ONLY SCREEN</Text>
          </View>

          <Text style={styles.title}>Access Restricted for Admin</Text>

          <Text style={styles.description}>
            You are currently signed in as Administrator (
            <Text style={styles.bold}>{user?.email || 'admin@gmail.com'}</Text>).
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📋 Access Control Rule:</Text>
            <Text style={styles.infoItem}>
              • <Text style={styles.bold}>{screenTitle}</Text> is strictly available for <Text style={styles.bold}>Customers only</Text>.
            </Text>
            <Text style={styles.infoItem}>
              • Administrators only have access to <Text style={styles.bold}>Home Screen</Text> and <Text style={styles.bold}>Analysis Screen</Text>.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/analysis')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>📊 Go to Analysis Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🏠 Go to Home Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              toggleRole();
              router.replace('/');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.switchButtonText}>🔄 Switch to Customer Role</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  icon: {
    fontSize: 28,
  },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A192F',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0A192F',
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 6,
  },
  infoItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#0A192F',
    fontSize: 13,
    fontWeight: '600',
  },
  switchButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    width: '100%',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
});

