import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';

export default function CustomDrawerContent(props) {
  const {
    user,
    role,
    toggleRole,
    financialSummary,
    selectedMonth,
    logoutUser,
    isAuthenticated,
    loginUser,
  } = useFinance();

  const adminNavItems = [
    { label: 'Home Dashboard', route: '/', icon: '🏠', tag: 'Admin Portal & Sign In' },
    { label: 'Finance Analysis', route: '/analysis', icon: '📊', tag: 'System Audits & Reports' },
  ];

  const customerNavItems = [
    { label: 'Home Dashboard', route: '/', icon: '🏠', tag: 'Sign In & Sign Up' },
    { label: 'Finance Analysis', route: '/analysis', icon: '📊', tag: 'Daily / Weekly / Monthly' },
    { label: 'Transactions', route: '/transactions', icon: '💳', tag: 'Month-wise & Alerts' },
    { label: 'Overall Categories', route: '/categories', icon: '🏷️', tag: 'Overall & Month-wise View' },
    { label: 'Category Details', route: '/category-details?name=Food %26 Groceries', icon: '🔍', tag: 'Category Details (Stack Screen)' },
    { label: 'Customer Profile', route: '/profile', icon: '👤', tag: 'Profile & Edit Profile' },
  ];

  const navItems = role === 'Admin' ? adminNavItems : customerNavItems;

  const handleNavigate = (route) => {
    if (props.navigation && props.navigation.closeDrawer) {
      props.navigation.closeDrawer();
    }
    router.push(route);
  };

  const handleLogout = () => {
    if (props.navigation && props.navigation.closeDrawer) {
      props.navigation.closeDrawer();
    }
    logoutUser();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Drawer Header with App Brand (Navy Theme) */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>₹</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Finance Tracker</Text>
            <Text style={styles.brandSubtitle}>Smart Budget & Expense Tracker</Text>
          </View>
        </View>

        {/* Authenticated vs Guest Card */}
        {isAuthenticated ? (
          <>
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.avatar || 'U'}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
                <View style={styles.roleBadgeRow}>
                  <View
                    style={[
                      styles.roleBadge,
                      role === 'Admin' ? styles.adminBadge : styles.customerBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleBadgeText,
                        role === 'Admin' ? styles.adminText : styles.customerText,
                      ]}
                    >
                      Active Role: {role}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

          </>
        ) : (
          <View style={styles.guestCard}>
            <Text style={styles.guestTitle}>Welcome to Finance Tracker</Text>
            <Text style={styles.guestSubtitle}>
              Please sign in with your email to unlock your dashboard and transactions.
            </Text>
            <TouchableOpacity
              style={[styles.quickAuthBtn, { width: '100%', marginTop: 10 }]}
              onPress={() => handleNavigate('/')}
            >
              <Text style={styles.quickAuthBtnText}>🔑 Go to Sign In Screen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Financial Snapshot (Only if Authenticated) */}
      {isAuthenticated && (
        <View style={styles.snapshotCard}>
          <Text style={styles.snapshotTitle}>{selectedMonth} Overview</Text>
          <View style={styles.snapshotRow}>
            <View>
              <Text style={styles.snapshotLabel}>Balance</Text>
              <Text style={styles.snapshotValue}>
                ₹{financialSummary.balance.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.snapshotDivider} />
            <View>
              <Text style={styles.snapshotLabel}>Expenses</Text>
              <Text style={[styles.snapshotValue, { color: '#EF4444' }]}>
                ₹{financialSummary.expense.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Navigation Links */}
      <View style={styles.navSection}>
        <Text style={styles.sectionHeading}>NAVIGATION MENU (Drawer)</Text>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => handleNavigate(item.route)}
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <Text style={styles.navIcon}>{item.icon}</Text>
              <View>
                <Text style={styles.navLabel}>{item.label}</Text>
                <Text style={styles.navTag}>{item.tag}</Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Features Badge */}
      <View style={styles.complianceCard}>
        <Text style={styles.complianceTitle}>✨ Finance Management</Text>
        <Text style={styles.complianceItem}>✓ Multi-Account Support</Text>
        <Text style={styles.complianceItem}>✓ Real-Time Analytics & Reports</Text>
        <Text style={styles.complianceItem}>✓ Smart Budget & Category Control</Text>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {isAuthenticated ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => handleNavigate('/login')}
          >
            <Text style={styles.authButtonText}>🔑 Open Sign In Screen</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#0A192F',
    padding: 20,
    paddingTop: 45,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    color: '#93C5FD',
    fontSize: 11,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  roleBadgeRow: {
    marginTop: 5,
    flexDirection: 'row',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  customerBadge: {
    backgroundColor: '#2563EB',
  },
  adminBadge: {
    backgroundColor: '#F59E0B',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  customerText: {
    color: '#FFFFFF',
  },
  adminText: {
    color: '#FFFFFF',
  },
  switchRoleButton: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  switchRoleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  guestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    borderRadius: 14,
  },
  guestTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guestSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  quickAuthRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickAuthBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAuthBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  snapshotCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  snapshotTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  snapshotLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  snapshotValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
    marginTop: 2,
  },
  snapshotDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  navSection: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A192F',
  },
  navTag: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  navArrow: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '300',
  },
  complianceCard: {
    margin: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  complianceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 6,
  },
  complianceItem: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  authButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
});
