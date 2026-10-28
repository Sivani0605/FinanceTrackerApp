import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import AuthGate from '@/components/AuthGate';
import CustomerOnlyGate from '@/components/CustomerOnlyGate';

const MONTH_OPTIONS = [
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
];

export default function CategoryDetailsScreen() {
  const params = useLocalSearchParams();
  const {
    user,
    role,
    selectedMonth,
    setSelectedMonth,
    transactions,
    categories,
    updateCategoryBudget,
    isAuthenticated,
  } = useFinance();

  if (!isAuthenticated) {
    return <AuthGate screenTitle="Category Details" />;
  }

  if (role === 'Admin') {
    return <CustomerOnlyGate screenTitle="Category Details Screen (Customer Only)" />;
  }

  // Active Category state (defaults to passed param or first category)
  const initialCategoryName = (params.name || params.category || 'Food & Groceries').toString();
  const [activeCategoryName, setActiveCategoryName] = useState(initialCategoryName);

  // Find matched category from context
  const matchedCategory = useMemo(() => {
    return (
      categories.find((c) => c.name.toLowerCase() === activeCategoryName.toLowerCase()) ||
      categories[0]
    );
  }, [categories, activeCategoryName]);

  const currentCategoryName = matchedCategory ? matchedCategory.name : activeCategoryName;
  const currentBudget = matchedCategory ? Number(matchedCategory.budget) : 8000;
  const currentIcon = matchedCategory ? matchedCategory.icon : '🍔';
  const currentDesc = matchedCategory ? matchedCategory.description : 'Category spending';

  // Transactions belonging to this category in the currently selected month
  const categoryTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.month === selectedMonth &&
        t.category.toLowerCase() === currentCategoryName.toLowerCase()
    );
  }, [transactions, selectedMonth, currentCategoryName]);

  // Recalculate spent exclusively for this category & month
  const currentSpent = useMemo(() => {
    return categoryTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [categoryTransactions]);

  // Budget Modal State
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [newBudgetInput, setNewBudgetInput] = useState(String(currentBudget));

  const percentUtilized =
    currentBudget > 0 ? Math.min(100, Math.round((currentSpent / currentBudget) * 100)) : 0;
  const remaining = Math.max(0, currentBudget - currentSpent);
  const avgSpend =
    categoryTransactions.length > 0
      ? Math.round(currentSpent / categoryTransactions.length)
      : 0;

  const handleSaveBudget = () => {
    const num = Number(newBudgetInput);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Validation Error', 'Budget limit must be a positive number greater than 0.');
      return;
    }

    if (matchedCategory) {
      updateCategoryBudget(matchedCategory.id, num);
    } else {
      Alert.alert('Budget Updated', `Budget for ${currentCategoryName} updated to ₹${num}.`);
    }

    setBudgetModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Stack Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Category Details Screen</Text>
          <Text style={styles.headerSub}>
            {currentCategoryName} • {selectedMonth}
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Stack Screen</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Switcher Horizontal Bar */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorSectionTitle}>Select Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {categories.map((c) => {
              const isSelected = c.name.toLowerCase() === currentCategoryName.toLowerCase();
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catPill, isSelected && styles.catPillActive]}
                  onPress={() => {
                    setActiveCategoryName(c.name);
                    setNewBudgetInput(String(c.budget));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catPillIcon}>{c.icon}</Text>
                  <Text
                    style={[styles.catPillText, isSelected && styles.catPillTextActive]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Month Switcher Horizontal Bar */}
          <Text style={[styles.selectorSectionTitle, { marginTop: 12 }]}>
            Select Month
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthScroll}
          >
            {MONTH_OPTIONS.map((m) => {
              const isSelected = selectedMonth === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthPill, isSelected && styles.monthPillActive]}
                  onPress={() => setSelectedMonth(m)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.monthPillText, isSelected && styles.monthPillTextActive]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Category Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconCircle}>
              <Text style={styles.heroIcon}>{currentIcon}</Text>
            </View>
            <View style={styles.heroNameCol}>
              <Text style={styles.heroCategoryName}>{currentCategoryName}</Text>
              <Text style={styles.heroCategoryDesc}>{currentDesc}</Text>
            </View>
          </View>

          <View style={styles.heroAmountRow}>
            <View>
              <Text style={styles.heroLabel}>Total Spent in {selectedMonth}</Text>
              <Text style={styles.heroSpentAmount}>
                ₹{currentSpent.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.budgetPill}>
              <Text style={styles.budgetPillText}>
                Budget: ₹{currentBudget.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${percentUtilized}%`,
                    backgroundColor:
                      percentUtilized > 90
                        ? '#EF4444'
                        : percentUtilized > 70
                        ? '#F59E0B'
                        : '#38BDF8',
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressPercentText}>{percentUtilized}% Utilized</Text>
              <Text style={styles.progressRemainingText}>
                ₹{remaining.toLocaleString('en-IN')} Remaining
              </Text>
            </View>
          </View>

          {/* Edit Budget Limit Button */}
          <TouchableOpacity
            style={styles.editBudgetBtn}
            onPress={() => {
              setNewBudgetInput(String(currentBudget));
              setBudgetModalVisible(true);
            }}
          >
            <Text style={styles.editBudgetBtnText}>✏️ Edit Category Budget Limit</Text>
          </TouchableOpacity>
        </View>

        {/* Statistical Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Entries</Text>
            <Text style={styles.metricVal}>{categoryTransactions.length}</Text>
            <Text style={styles.metricSub}>In {selectedMonth}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Average / Entry</Text>
            <Text style={styles.metricVal}>₹{avgSpend.toLocaleString('en-IN')}</Text>
            <Text style={styles.metricSub}>Per transaction</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Budget Status</Text>
            <Text
              style={[
                styles.metricVal,
                { color: percentUtilized > 90 ? '#EF4444' : '#10B981', fontSize: 13 },
              ]}
            >
              {percentUtilized > 90 ? '⚠️ High Spend' : '✓ Healthy'}
            </Text>
            <Text style={styles.metricSub}>
              {currentSpent <= currentBudget ? 'Under limit' : 'Exceeded'}
            </Text>
          </View>
        </View>

        {/* Category Transactions Drilldown */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionHeading}>
              {currentCategoryName} Transactions ({categoryTransactions.length})
            </Text>
            <Text style={styles.sectionMonthTag}>{selectedMonth}</Text>
          </View>

          {categoryTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyText}>
                No transactions recorded under {currentCategoryName} in {selectedMonth}.
              </Text>
            </View>
          ) : (
            categoryTransactions.map((tx) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIconCircle,
                      {
                        backgroundColor:
                          tx.type === 'income' ? '#E8F5E9' : '#FEE2E2',
                      },
                    ]}
                  >
                    <Text style={styles.txIconArrow}>
                      {tx.type === 'income' ? '↗' : '↘'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txDate}>
                      {tx.date} • {tx.paymentMethod}
                    </Text>
                    {tx.notes ? (
                      <Text style={styles.txNotes}>&ldquo;{tx.notes}&rdquo;</Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      tx.type === 'income' ? styles.txIncome : styles.txExpense,
                    ]}
                  >
                    {tx.type === 'income' ? '+' : '-'} ₹
                    {Number(tx.amount).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        visible={budgetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Category Budget</Text>
              <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalCategoryName}>Category: {currentCategoryName}</Text>
            <Text style={styles.modalDesc}>
              Set the monthly allocated budget threshold for {user.name}. A personalized alert will
              be triggered on update.
            </Text>

            <Text style={styles.inputLabel}>New Monthly Budget (₹) *</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="e.g. 10000"
              value={newBudgetInput}
              onChangeText={setNewBudgetInput}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveBudget}>
              <Text style={styles.modalSaveBtnText}>Save Budget</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backArrow: {
    fontSize: 20,
    color: '#0A192F',
    fontWeight: 'bold',
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  catScroll: {
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  catPillIcon: {
    fontSize: 14,
  },
  catPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  monthScroll: {
    gap: 8,
  },
  monthPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthPillActive: {
    backgroundColor: '#0A192F',
    borderColor: '#0A192F',
  },
  monthPillText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#0A192F',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    fontSize: 24,
  },
  heroNameCol: {
    flex: 1,
  },
  heroCategoryName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroCategoryDesc: {
    color: '#93C5FD',
    fontSize: 11,
    marginTop: 2,
  },
  heroAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  heroLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  heroSpentAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  budgetPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.4)',
  },
  budgetPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressPercentText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  progressRemainingText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  editBudgetBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  editBudgetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A192F',
    marginTop: 4,
  },
  metricSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: 4,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  sectionMonthTag: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconArrow: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  txDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  txNotes: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  modalClose: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  modalCategoryName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0A192F',
    marginBottom: 16,
  },
  modalSaveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
