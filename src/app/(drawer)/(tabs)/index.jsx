import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import ScreenHeader from '@/components/ScreenHeader';

export default function HomeScreen() {
  const {
    user,
    role,
    setRole,
    toggleRole,
    isAuthenticated,
    loginUser,
    logoutUser,
    admins,
    addAdmin,
    customers,
    registerCustomer,
    selectedMonth,
    financialSummary,
    reportPeriod,
    setReportPeriod,
    reportData,
    monthTransactions,
    categories,
    recentAlerts,
  } = useFinance();

  // Auth Mode on Home Screen when not authenticated
  const [authMode, setAuthMode] = useState('SIGN_IN'); // 'SIGN_IN' or 'SIGN_UP'
  const [authRole, setAuthRole] = useState('Customer'); // 'Customer' or 'Admin'

  // Sign In form inputs (starts empty so user types email & password)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up form inputs
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Add Admin Modal states
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Finance Operations Admin');
  const [newAdminDept, setNewAdminDept] = useState('Executive Accounts');
  const [newAdminPhone, setNewAdminPhone] = useState('');

  const handleCreateNewAdmin = () => {
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      Alert.alert('Validation Error', 'Admin name and email address are required.');
      return;
    }
    if (!newAdminEmail.includes('@') || !newAdminEmail.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    const success = addAdmin({
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      roleTitle: newAdminRole.trim(),
      department: newAdminDept.trim(),
      phone: newAdminPhone.trim(),
    });

    if (success) {
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPhone('');
      setAdminModalVisible(false);
    }
  };

  // Handle Home Screen Sign In
  const handleHomeLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    if (!loginEmail.includes('@') || !loginEmail.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must have at least 6 characters.');
      return;
    }

    loginUser(authRole, loginEmail.trim());
  };

  // Handle Home Screen Sign Up
  const handleHomeSignup = () => {
    if (!signupName.trim() || signupName.trim().length < 3) {
      Alert.alert('Validation Error', 'Full Name must be at least 3 characters long.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@') || !signupEmail.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (signupPhone.replace(/\D/g, '').length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (signupPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must have at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match. Please verify.');
      return;
    }

    if (authRole === 'Admin') {
      addAdmin({
        name: signupName.trim(),
        email: signupEmail.trim(),
        roleTitle: 'Administrator',
        phone: signupPhone.trim(),
      });
    } else {
      registerCustomer({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
      });
    }

    loginUser(authRole, signupEmail.trim(), signupName.trim());
    Alert.alert(
      'Account Created & Unlocked',
      `Welcome ${signupName.trim()}! Your ${authRole} account is now active.`
    );
  };

  const handleAdminAuditAlert = () => {
    Alert.alert(
      'Admin Platform Report',
      `Audit Summary for Admin ${user.name}:\n\n` +
        `• Total Monitored Accounts: 1,420\n` +
        `• Total Platform Turnover: ₹12,45,000\n` +
        `• October Processed Records: ${monthTransactions.length} customer entries\n` +
        `• Server Security Status: 99.98% Uptime (All Systems Operational)`
    );
  };

  const recentTxList = monthTransactions.slice(0, 4);
  const topCategories = categories.slice(0, 3);

  // =========================================================================
  // VIEW 1: HOME SCREEN WITH SIGN IN & SIGN UP OPTIONS (When NOT Signed In)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Finance Tracker"
          subtitle="Personal Finance & Budget"
        />

        <ScrollView
          contentContainerStyle={styles.authScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Branding Section (Navy & Blue Palette) */}
          <View style={styles.authHeroSection}>
            <View style={styles.authLogoBadge}>
              <Text style={styles.authLogoSymbol}>₹</Text>
            </View>
            <Text style={styles.authAppTitle}>Finance Budget Tracker</Text>
            <Text style={styles.authAppSubtitle}>
              Smart budgeting, month-wise transactions & real-time analytics
            </Text>

            <View style={styles.authBadgePill}>
              <Text style={styles.authBadgeText}>
                Smart Budgeting • Instant Insights • Secure
              </Text>
            </View>
          </View>

          {/* Role Selection Box */}
          <View style={styles.authCard}>
            <Text style={styles.authSectionHeader}>SELECT USER ROLE</Text>
            <View style={styles.roleTabsRow}>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  authRole === 'Customer' && styles.roleTabActive,
                ]}
                onPress={() => setAuthRole('Customer')}
              >
                <Text style={styles.roleTabIcon}>👤</Text>
                <Text
                  style={[
                    styles.roleTabText,
                    authRole === 'Customer' && styles.roleTabTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleTab,
                  authRole === 'Admin' && styles.roleTabActiveAdmin,
                ]}
                onPress={() => setAuthRole('Admin')}
              >
                <Text style={styles.roleTabIcon}>👑</Text>
                <Text
                  style={[
                    styles.roleTabText,
                    authRole === 'Admin' && styles.roleTabTextActiveAdmin,
                  ]}
                >
                  Administrator
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In vs Sign Up Segmented Control */}
            <View style={styles.authSegmentContainer}>
              <TouchableOpacity
                style={[
                  styles.authSegmentBtn,
                  authMode === 'SIGN_IN' && styles.authSegmentBtnActive,
                ]}
                onPress={() => setAuthMode('SIGN_IN')}
              >
                <Text
                  style={[
                    styles.authSegmentText,
                    authMode === 'SIGN_IN' && styles.authSegmentTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.authSegmentBtn,
                  authMode === 'SIGN_UP' && styles.authSegmentBtnActive,
                ]}
                onPress={() => setAuthMode('SIGN_UP')}
              >
                <Text
                  style={[
                    styles.authSegmentText,
                    authMode === 'SIGN_UP' && styles.authSegmentTextActive,
                  ]}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORM 1: SIGN IN */}
            {authMode === 'SIGN_IN' ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>
                  {authRole} Email Address *
                </Text>
                <TextInput
                  style={styles.authInput}
                  placeholder={
                    authRole === 'Admin'
                      ? 'Type admin email (e.g. admin@gmail.com)'
                      : 'Type customer email (e.g. sivani@gmail.com)'
                  }
                  placeholderTextColor="#94A3B8"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Password *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="Type your password"
                  placeholderTextColor="#94A3B8"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry
                />

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleHomeLogin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitBtnText}>
                    Sign In as {authRole} & Unlock Dashboard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stackLinkBtn}
                  onPress={() => router.push('/login')}
                >
                  <Text style={styles.stackLinkText}>
                    Open Dedicated Sign In Screen →
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* FORM 2: SIGN UP */
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="e.g. Sivani Murugesan"
                  placeholderTextColor="#94A3B8"
                  value={signupName}
                  onChangeText={setSignupName}
                />

                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="e.g. sivani@gmail.com"
                  placeholderTextColor="#94A3B8"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Mobile Phone *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor="#94A3B8"
                  value={signupPhone}
                  onChangeText={setSignupPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>Password (min 6 chars) *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="Create password"
                  placeholderTextColor="#94A3B8"
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry
                />

                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#94A3B8"
                  value={signupConfirmPassword}
                  onChangeText={setSignupConfirmPassword}
                  secureTextEntry
                />

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleHomeSignup}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitBtnText}>
                    Create {authRole} Account & Unlock
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stackLinkBtn}
                  onPress={() => router.push('/signup')}
                >
                  <Text style={styles.stackLinkText}>
                    Open Dedicated Sign Up Screen →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // =========================================================================
  // VIEW 2: FULL FINANCIAL DASHBOARD (When SIGNED IN)
  // =========================================================================
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Finance Tracker"
        subtitle={`Welcome, ${user.name}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Status Bar with Quick Sign Out */}
        <View style={styles.userStatusBar}>
          <View style={styles.userStatusLeft}>
            <View style={styles.statusAvatarCircle}>
              <Text style={styles.statusAvatarText}>{user.avatar || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.statusGreeting}>
                Hello, {user.name} 👋
              </Text>
              <Text style={styles.statusRoleSubtitle}>
                Active Profile: <Text style={styles.statusRoleHighlight}>{role}</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.uniqueSignOutBtn}
            onPress={logoutUser}
            activeOpacity={0.8}
          >
            <Text style={styles.uniqueSignOutIcon}>🚪</Text>
            <Text style={styles.uniqueSignOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Personalized Alert Notification Banner */}
        {recentAlerts.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.alertHeaderRow}>
              <Text style={styles.alertIcon}>🔔</Text>
              <Text style={styles.alertTitle}>Personalized Alert Message</Text>
              <Text style={styles.alertTime}>{recentAlerts[0].time}</Text>
            </View>
            <Text style={styles.alertMessage} numberOfLines={2}>
              {recentAlerts[0].message}
            </Text>
          </View>
        )}

        {/* Admin Dashboard Card (Shown if Role is Admin) */}
        {role === 'Admin' && (
          <View style={styles.adminCard}>
            <View style={styles.adminHeaderRow}>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN CONSOLE</Text>
              </View>
              <View style={styles.adminHeaderActions}>
                <TouchableOpacity
                  style={styles.addAdminBtn}
                  onPress={() => setAdminModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addAdminBtnText}>➕ Add Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminActionPill}
                  onPress={handleAdminAuditAlert}
                >
                  <Text style={styles.adminActionText}>Audit Report</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.adminHeading}>
              Platform Governance & System Team
            </Text>

            <View style={styles.adminMetricsGrid}>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricLabel}>Administrators</Text>
                <Text style={styles.adminMetricVal}>{admins.length}</Text>
              </View>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricLabel}>Total Customers</Text>
                <Text style={styles.adminMetricVal}>{customers.length + 1418}</Text>
              </View>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricLabel}>Platform Health</Text>
                <Text style={[styles.adminMetricVal, { color: '#38BDF8' }]}>
                  99.9%
                </Text>
              </View>
            </View>

            {/* Administrator Team List */}
            <View style={styles.adminTeamSection}>
              <View style={styles.adminTeamHeaderRow}>
                <Text style={styles.adminTeamTitle}>
                  Platform Administrators ({admins.length})
                </Text>
                <TouchableOpacity onPress={() => setAdminModalVisible(true)}>
                  <Text style={styles.adminTeamAddLink}>+ Add New</Text>
                </TouchableOpacity>
              </View>

              {admins.map((adm) => {
                const isCurrent =
                  user.email.toLowerCase() === adm.email.toLowerCase();
                return (
                  <View key={adm.id} style={styles.adminRowCard}>
                    <View style={styles.adminRowLeft}>
                      <View style={styles.adminAvatarCircle}>
                        <Text style={styles.adminAvatarText}>
                          {adm.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.adminInfoCol}>
                        <View style={styles.adminNameRow}>
                          <Text style={styles.adminName}>{adm.name}</Text>
                          {isCurrent && (
                            <View style={styles.currentAdminBadge}>
                              <Text style={styles.currentAdminText}>Active Now</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.adminEmail}>{adm.email}</Text>
                        <Text style={styles.adminDept}>
                          {adm.role} • {adm.department}
                        </Text>
                      </View>
                    </View>

                    {!isCurrent && (
                      <TouchableOpacity
                        style={styles.switchAdminBtn}
                        onPress={() => loginUser('Admin', adm.email, adm.name)}
                      >
                        <Text style={styles.switchAdminText}>Switch</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Navy Hero Card - Total Balance */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total Balance ({selectedMonth})</Text>
              <Text style={styles.heroAmount}>
                ₹{financialSummary.balance.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.savingsRateBadge}>
              <Text style={styles.savingsRateText}>
                {financialSummary.savingsRate}% Saved
              </Text>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={() => router.push('/transactions')}
              activeOpacity={0.8}
            >
              <Text style={styles.heroActionIcon}>➕</Text>
              <Text style={styles.heroActionLabel}>Add Tx</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={() => router.push('/analysis')}
              activeOpacity={0.8}
            >
              <Text style={styles.heroActionIcon}>📊</Text>
              <Text style={styles.heroActionLabel}>Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={() => router.push('/categories')}
              activeOpacity={0.8}
            >
              <Text style={styles.heroActionIcon}>🏷️</Text>
              <Text style={styles.heroActionLabel}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={logoutUser}
              activeOpacity={0.8}
            >
              <Text style={styles.heroActionIcon}>🚪</Text>
              <Text style={styles.heroActionLabel}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Income vs Expenses Summary Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.incomeCard]}>
            <View style={styles.statIconBadgeGreen}>
              <Text style={styles.statArrowGreen}>↗</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.incomeAmount}>
                + ₹{financialSummary.income.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.expenseCard]}>
            <View style={styles.statIconBadgeRed}>
              <Text style={styles.statArrowRed}>↘</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Total Expenses</Text>
              <Text style={styles.expenseAmount}>
                - ₹{financialSummary.expense.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Spending Categories Preview */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Spending Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.viewAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          {topCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: '/category-details',
                  params: {
                    categoryId: cat.id,
                    name: cat.name,
                    budget: cat.budget,
                    spent: cat.spent,
                    icon: cat.icon,
                    color: cat.color,
                  },
                })
              }
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIconCircle,
                  { backgroundColor: cat.bgColor || '#EFF6FF' },
                ]}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
              </View>
              <View style={styles.categoryInfoCol}>
                <View style={styles.categoryRowTop}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categorySpent}>
                    ₹{cat.spent.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.categoryRowBottom}>
                  <View style={styles.categoryBarBg}>
                    <View
                      style={[
                        styles.categoryBarFill,
                        { width: `${cat.percent}%`, backgroundColor: cat.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPercent}>{cat.percent}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions Preview */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={styles.viewAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          {recentTxList.map((tx) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View
                style={[
                  styles.txIconCircle,
                  {
                    backgroundColor:
                      tx.type === 'income' ? '#EFF6FF' : '#FEE2E2',
                  },
                ]}
              >
                <Text style={styles.txIcon}>
                  {tx.type === 'income' ? '↗' : '↘'}
                </Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txCategory}>
                  {tx.category} • {tx.paymentMethod}
                </Text>
              </View>
              <View style={styles.txAmountCol}>
                <Text
                  style={[
                    styles.txAmount,
                    tx.type === 'income' ? styles.txIncome : styles.txExpense,
                  ]}
                >
                  {tx.type === 'income' ? '+' : '-'} ₹
                  {tx.amount.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Add New Administrator Modal */}
      <Modal
        visible={adminModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAdminModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Administrator</Text>
                <Text style={styles.modalSub}>
                  Create a new platform administrator account
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAdminModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Admin Full Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Anand Kumar"
              placeholderTextColor="#94A3B8"
              value={newAdminName}
              onChangeText={setNewAdminName}
            />

            <Text style={styles.modalLabel}>Admin Email Address *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. anand.admin@gmail.com"
              placeholderTextColor="#94A3B8"
              value={newAdminEmail}
              onChangeText={setNewAdminEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.modalLabel}>Role Designation</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Finance Auditor, Operations Admin"
              placeholderTextColor="#94A3B8"
              value={newAdminRole}
              onChangeText={setNewAdminRole}
            />

            <Text style={styles.modalLabel}>Department</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Audit, Accounts, Treasury"
              placeholderTextColor="#94A3B8"
              value={newAdminDept}
              onChangeText={setNewAdminDept}
            />

            <Text style={styles.modalLabel}>Contact Phone (Optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 9876500099"
              placeholderTextColor="#94A3B8"
              value={newAdminPhone}
              onChangeText={setNewAdminPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleCreateNewAdmin}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSubmitBtnText}>Create Administrator</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // ==================== AUTH VIEW STYLES ====================
  authScrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  authHeroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  authLogoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0A192F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  authLogoSymbol: {
    color: '#38BDF8',
    fontSize: 40,
    fontWeight: 'bold',
  },
  authAppTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A192F',
    textAlign: 'center',
  },
  authAppSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 320,
  },
  authBadgePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  authBadgeText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  authSectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  roleTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  roleTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleTabActiveAdmin: {
    backgroundColor: '#B45309',
    borderColor: '#B45309',
  },
  roleTabIcon: {
    fontSize: 16,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  roleTabTextActiveAdmin: {
    color: '#FFFFFF',
  },
  quickTestBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  quickTestTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickTestRow: {
    flexDirection: 'column',
    gap: 8,
  },
  quickTestBtnCustomer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickTestTextCustomer: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  quickTestBtnAdmin: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickTestTextAdmin: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  authSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  authSegmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  authSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  authSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  authSegmentTextActive: {
    color: '#0A192F',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 6,
    marginTop: 10,
  },
  authInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: '#0A192F',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stackLinkBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  stackLinkText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  complianceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  complianceHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  complianceItem: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '500',
  },

  // ==================== DASHBOARD VIEW STYLES ====================
  userStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusGreeting: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  statusRoleSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusRoleHighlight: {
    fontWeight: '700',
    color: '#2563EB',
  },
  rolePillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  roleDot: {
    fontSize: 8,
    color: '#2563EB',
  },
  uniqueSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    elevation: 1,
  },
  uniqueSignOutIcon: {
    fontSize: 13,
  },
  uniqueSignOutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  alertBanner: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertIcon: {
    fontSize: 14,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
    flex: 1,
  },
  alertTime: {
    fontSize: 10,
    color: '#2563EB',
  },
  alertMessage: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
  adminCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  adminHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addAdminBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  addAdminBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  adminBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  adminActionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminActionText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  adminHeading: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  adminMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  adminMetric: {
    flex: 1,
  },
  adminMetricLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  adminMetricVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  adminTeamSection: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingTop: 12,
  },
  adminTeamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminTeamTitle: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  adminTeamAddLink: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  adminRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  adminRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  adminAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminInfoCol: {
    flex: 1,
  },
  adminNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  currentAdminBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  currentAdminText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  adminEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  adminDept: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
  },
  switchAdminBtn: {
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  switchAdminText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0A192F',
    borderRadius: 22,
    padding: 20,
    elevation: 4,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '500',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 6,
  },
  savingsRateBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  savingsRateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroActionButton: {
    alignItems: 'center',
    gap: 4,
  },
  heroActionIcon: {
    fontSize: 18,
  },
  heroActionLabel: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    elevation: 2,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  statIconBadgeGreen: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statArrowGreen: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
  },
  statIconBadgeRed: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statArrowRed: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  incomeAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 2,
  },
  reportSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  periodPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 3,
  },
  periodPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  periodPillActive: {
    backgroundColor: '#2563EB',
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  periodPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reportCardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  reportStatusBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  reportMetricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  reportMetricBox: {
    flex: 1,
  },
  reportMetricTitle: {
    fontSize: 11,
    color: '#64748B',
  },
  reportMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
    marginTop: 3,
  },
  reportFootnote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 10,
    fontStyle: 'italic',
  },
  weeklyTotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0A192F',
    marginBottom: 8,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    fontSize: 8,
    color: '#94A3B8',
    marginBottom: 3,
  },
  barFill: {
    width: 14,
    backgroundColor: '#93C5FD',
    borderRadius: 6,
  },
  barFillPeak: {
    backgroundColor: '#2563EB',
  },
  barLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  barLabelPeak: {
    fontWeight: 'bold',
    color: '#2563EB',
  },
  monthlyProgressContainer: {
    marginBottom: 12,
  },
  monthlyProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  monthlyProgressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  monthlyProgressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  sectionContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryInfoCol: {
    flex: 1,
  },
  categoryRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A192F',
  },
  categorySpent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  categoryRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  txCategory: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txIncome: {
    color: '#10B981',
  },
  txExpense: {
    color: '#EF4444',
  },
  txDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  bottomSignOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomSignOutTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  bottomSignOutSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  bottomSignOutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bottomSignOutBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // ==================== MODAL STYLES ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalClose: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A192F',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0A192F',
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
