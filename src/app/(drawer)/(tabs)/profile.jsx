import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import ScreenHeader from '@/components/ScreenHeader';
import AuthGate from '@/components/AuthGate';
import CustomerOnlyGate from '@/components/CustomerOnlyGate';

export default function ProfileScreen() {
  const { user, role, updateProfile, logoutUser, isAuthenticated } = useFinance();

  if (!isAuthenticated) {
    return <AuthGate screenTitle="Customer Profile & Settings" />;
  }

  if (role === 'Admin') {
    return <CustomerOnlyGate screenTitle="Profile and Edit Profile Screen (Customer Only)" />;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [monthlyBudget, setMonthlyBudget] = useState(String(user.monthlyBudget));

  // Preferences toggles
  const [txAlertsEnabled, setTxAlertsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '9876543210');
    setAddress(user.address || 'Coimbatore, Tamil Nadu');
    setMonthlyBudget(String(user.monthlyBudget || 35000));
  }, [user]);

  const handleSaveProfile = () => {
    // Basic Form Validations
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert('Validation Error', 'Full Name must be at least 2 characters long.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address (e.g. user@domain.com).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Validation Error', 'Phone number must be at least 10 digits.');
      return;
    }

    const numBudget = Number(monthlyBudget);
    if (isNaN(numBudget) || numBudget <= 0) {
      Alert.alert('Validation Error', 'Monthly budget limit must be a positive number greater than ₹0.');
      return;
    }

    const ok = updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      monthlyBudget: numBudget,
    });

    if (ok) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setAddress(user.address);
    setMonthlyBudget(String(user.monthlyBudget));
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logoutUser();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Customer Profile"
        subtitle={isEditing ? 'Editing Profile Details' : 'Manage Personal & Account Data'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Avatar & Header Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatar || 'S'}</Text>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRoleTag}>
            {role === 'Customer' ? 'Verified Customer' : 'System Administrator'}
          </Text>

          <View style={styles.metaChipRow}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>KYC: Verified ✅</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Account: {user.accountNumber}</Text>
            </View>
          </View>
        </View>

        {/* Profile Mode Banner: View Mode vs Edit Mode */}
        <View style={styles.modeCard}>
          <View style={styles.modeTextCol}>
            <Text style={styles.modeTitle}>
              {isEditing ? '✏️ Edit Profile Mode' : '👁️ View Profile Mode'}
            </Text>
            <Text style={styles.modeSub}>
              {isEditing
                ? 'Update fields below and click Save Changes'
                : 'Click Edit Profile to modify your personal information'}
            </Text>
          </View>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Details Form */}
        <View style={styles.formCard}>
          <Text style={styles.formHeading}>PERSONAL INFORMATION</Text>

          {/* Full Name */}
          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder="Enter full name"
          />

          {/* Email Address */}
          <Text style={styles.fieldLabel}>Email Address *</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter email address"
          />

          {/* Phone Number */}
          <Text style={styles.fieldLabel}>Phone Number * (10 Digits)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />

          {/* Address */}
          <Text style={styles.fieldLabel}>Residential Address / City</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
            placeholder="Enter city or address"
          />

          {/* Monthly Budget */}
          <Text style={styles.fieldLabel}>Monthly Budget Limit (₹) *</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            editable={isEditing}
            keyboardType="numeric"
            placeholder="Enter monthly budget"
          />

          {/* Save Button (when editing) */}
          {isEditing && (
            <TouchableOpacity
              style={styles.saveChangesBtn}
              onPress={handleSaveProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.saveChangesBtnText}>💾 Save Profile Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Security & Preferences */}
        <View style={styles.preferencesCard}>
          <Text style={styles.formHeading}>SECURITY & NOTIFICATIONS</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextCol}>
              <Text style={styles.preferenceTitle}>Personalized Transaction Alerts</Text>
              <Text style={styles.preferenceSub}>
                Get instant notifications when transactions are added or updated
              </Text>
            </View>
            <Switch
              value={txAlertsEnabled}
              onValueChange={setTxAlertsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={txAlertsEnabled ? '#2563EB' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextCol}>
              <Text style={styles.preferenceTitle}>Biometric Authentication</Text>
              <Text style={styles.preferenceSub}>
                Quick sign in using Fingerprint or Face ID
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={biometricsEnabled ? '#2563EB' : '#94A3B8'}
            />
          </View>
        </View>

        {/* App Info & Sign Out */}
        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutBtnText}>🚪 Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.appInfoText}>
            Finance Tracker App v1.0.0 • Secure & Encrypted Personal Finance
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 36,
  },
  avatarCard: {
    backgroundColor: '#0A192F',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userRoleTag: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 3,
  },
  metaChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  metaChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  modeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  modeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0A192F',
  },
  inputDisabled: {
    backgroundColor: '#F8FAFC',
    color: '#475569',
    borderColor: '#E2E8F0',
  },
  saveChangesBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 6,
    elevation: 2,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  preferenceTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  preferenceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  preferenceSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  signOutBtn: {
    width: '100%',
    backgroundColor: '#FEE2E2',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  appInfoText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

