import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useFinance } from '@/context/FinanceContext';

export default function ScreenHeader({ title, subtitle, showBack = false, onBack }) {
  const navigation = useNavigation();
  const { user, role, toggleRole, isAuthenticated, logoutUser } = useFinance();

  const handleOpenDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch {
      // fallback
    }
  };

  const handleHeaderSignOut = () => {
    Alert.alert('Sign Out', 'Do you want to sign out from Finance Tracker?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logoutUser(),
      },
    ]);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack || (() => navigation.goBack())}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleOpenDrawer}
            activeOpacity={0.7}
          >
            <View style={styles.hamburger}>
              <View style={styles.bar} />
              <View style={[styles.bar, { width: 14 }]} />
              <View style={styles.bar} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.titleCol}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {isAuthenticated ? (
          <>
            {/* Role Badge Indicator */}
            <View
              style={[
                styles.rolePill,
                role === 'Admin' ? styles.adminPill : styles.customerPill,
              ]}
            >
              <Text style={styles.roleDot}>●</Text>
              <Text
                style={[
                  styles.roleText,
                  role === 'Admin' ? styles.adminText : styles.customerText,
                ]}
              >
                {role}
              </Text>
            </View>

            {/* Quick Sign Out Header Button */}
            <TouchableOpacity
              style={styles.signOutHeaderBtn}
              onPress={handleHeaderSignOut}
              activeOpacity={0.7}
            >
              <Text style={styles.signOutHeaderText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.guestPill}>
            <Text style={styles.guestText}>Guest Mode</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backArrow: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  hamburger: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  bar: {
    height: 2.2,
    width: 18,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  customerPill: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
  },
  adminPill: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  roleDot: {
    fontSize: 8,
    color: '#2563EB',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  customerText: {
    color: '#1D4ED8',
  },
  adminText: {
    color: '#B45309',
  },
  signOutHeaderBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  signOutHeaderText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  guestPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  guestText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
