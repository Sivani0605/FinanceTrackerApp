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
import { router } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import ScreenHeader from '@/components/ScreenHeader';
import AuthGate from '@/components/AuthGate';
import CustomerOnlyGate from '@/components/CustomerOnlyGate';

const MONTH_OPTIONS = [
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
];

export default function CategoriesScreen() {
  const {
    user,
    role,
    categories,
    addCategory,
    selectedMonth,
    setSelectedMonth,
    monthTransactions,
    transactions,
    isAuthenticated,
  } = useFinance();

  if (!isAuthenticated) {
    return <AuthGate screenTitle="Budget Categories" />;
  }

  if (role === 'Admin') {
    return <CustomerOnlyGate screenTitle="Overall Categories Screen (Customer Only)" />;
  }

  // View Mode: 'overall' for Overall Categories Screen, 'monthwise' for Month-wise Category Breakdown
  const [viewMode, setViewMode] = useState('overall'); // 'overall' | 'monthwise'

  // Add Category Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Total allocated budget across all categories
  const totalAllocatedBudget = useMemo(() => {
    return categories.reduce((sum, c) => sum + Number(c.budget || 0), 0);
  }, [categories]);

  // Overall calculations across all transactions (for Overall Categories View)
  const allTimeCategorySpent = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  // Month-wise calculations for the selected month (for Month-wise Categories View)
  const currentMonthCategorySpent = useMemo(() => {
    return categories.reduce((sum, c) => sum + Number(c.spent || 0), 0);
  }, [categories]);

  const monthUtilizedPercent =
    totalAllocatedBudget > 0
      ? Math.min(100, Math.round((currentMonthCategorySpent / totalAllocatedBudget) * 100))
      : 0;

  const handleCreateCategory = () => {
    if (!newCatName.trim()) {
      Alert.alert('Validation Error', 'Category name cannot be empty.');
      return;
    }
    const numBudget = Number(newCatBudget);
    if (isNaN(numBudget) || numBudget <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid monthly budget limit (greater than 0).');
      return;
    }

    const success = addCategory({
      name: newCatName.trim(),
      budget: numBudget,
      icon: newCatIcon,
      description: newCatDesc.trim() || 'Custom spending category',
      color: '#2563EB',
    });

    if (success) {
      setNewCatName('');
      setNewCatBudget('');
      setNewCatDesc('');
      setModalVisible(false);
    }
  };

  const handleOpenDetails = (cat) => {
    router.push({
      pathname: '/category-details',
      params: {
        categoryId: cat.id,
        name: cat.name,
        budget: String(cat.budget),
        spent: String(cat.spent || 0),
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Budget Categories"
        subtitle={
          viewMode === 'overall'
            ? `Overall Categories Portfolio • ${categories.length} Categories`
            : `Category Month-Wise Breakdown • ${selectedMonth}`
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* View Mode Segmented Switcher (Distinct Overall vs Month-Wise) */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              viewMode === 'overall' && styles.segmentBtnActive,
            ]}
            onPress={() => setViewMode('overall')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentBtnText,
                viewMode === 'overall' && styles.segmentBtnTextActive,
              ]}
            >
              🏷️ Overall Categories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              viewMode === 'monthwise' && styles.segmentBtnActive,
            ]}
            onPress={() => setViewMode('monthwise')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentBtnText,
                viewMode === 'monthwise' && styles.segmentBtnTextActive,
              ]}
            >
              📅 Category Month-Wise
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* VIEW MODE 1: OVERALL CATEGORIES SCREEN                       */}
        {/* ============================================================ */}
        {viewMode === 'overall' && (
          <>
            {/* Overall Category Portfolio Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Overall Categories Portfolio</Text>
                </View>
                <Text style={styles.heroCatCount}>{categories.length} Active Categories</Text>
              </View>

              <Text style={styles.heroSub}>Total Budget Allocation</Text>
              <Text style={styles.heroAmount}>
                ₹{totalAllocatedBudget.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.heroDesc}>
                Total monthly budget distributed across {categories.length} essential and lifestyle categories.
              </Text>

              {/* Stats Row */}
              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Allocated Budget</Text>
                  <Text style={styles.heroStatValue}>
                    ₹{totalAllocatedBudget.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Active Month</Text>
                  <Text style={[styles.heroStatValue, { color: '#93C5FD' }]}>
                    {selectedMonth}
                  </Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Total Transactions</Text>
                  <Text style={styles.heroStatValue}>
                    {transactions.length} Records
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Action: Add New Category */}
            <TouchableOpacity
              style={styles.addCategoryBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addCategoryBtnIcon}>➕</Text>
              <Text style={styles.addCategoryBtnText}>Add New Budget Category</Text>
            </TouchableOpacity>

            {/* Overall Categories List */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>
                  All Budget Categories ({categories.length})
                </Text>
                <Text style={styles.sectionSub}>
                  Configured categories and standard monthly budget limits
                </Text>
              </View>
            </View>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => handleOpenDetails(cat)}
                activeOpacity={0.7}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.cardHeaderLeft}>
                    <View
                      style={[styles.catIconCircle, { backgroundColor: cat.bgColor || '#EFF6FF' }]}
                    >
                      <Text style={styles.catIcon}>{cat.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catMeta} numberOfLines={1}>
                        {cat.description || 'Standard spending category'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardHeaderRight}>
                    <Text style={styles.budgetAmountLabel}>Monthly Limit</Text>
                    <Text style={styles.budgetAmountVal}>
                      ₹{Number(cat.budget).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Card Footer with drilldown call to action */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.shareBadge}>
                    <Text style={styles.shareBadgeText}>
                      {totalAllocatedBudget > 0
                        ? `${Math.round((Number(cat.budget) / totalAllocatedBudget) * 100)}% of total budget`
                        : '0%'}
                    </Text>
                  </View>
                  <Text style={styles.viewDetailsText}>View Category Details →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ============================================================ */}
        {/* VIEW MODE 2: CATEGORY MONTH-WISE SCREEN                     */}
        {/* ============================================================ */}
        {viewMode === 'monthwise' && (
          <>
            {/* Month Selection Bar */}
            <View style={styles.monthSelectorCard}>
              <Text style={styles.monthSelectorTitle}>Select Active Month</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthScroll}
              >
                {MONTH_OPTIONS.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.monthPill,
                      selectedMonth === m && styles.monthPillActive,
                    ]}
                    onPress={() => setSelectedMonth(m)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.monthPillText,
                        selectedMonth === m && styles.monthPillTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Selected Month Budget Utilization Summary */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Month-Wise Category Breakdown</Text>
                </View>
                <Text style={styles.heroCatCount}>{selectedMonth}</Text>
              </View>

              <Text style={styles.heroSub}>Total Spent in {selectedMonth}</Text>
              <Text style={styles.heroAmount}>
                ₹{currentMonthCategorySpent.toLocaleString('en-IN')}
              </Text>

              {/* Progress Bar for the month */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(100, monthUtilizedPercent)}%`,
                        backgroundColor:
                          monthUtilizedPercent > 90
                            ? '#EF4444'
                            : monthUtilizedPercent > 70
                            ? '#F59E0B'
                            : '#2563EB',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentText}>{monthUtilizedPercent}% Utilized</Text>
              </View>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Allocated Budget</Text>
                  <Text style={styles.heroStatValue}>
                    ₹{totalAllocatedBudget.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Remaining Balance</Text>
                  <Text style={[styles.heroStatValue, { color: '#93C5FD' }]}>
                    ₹{Math.max(0, totalAllocatedBudget - currentMonthCategorySpent).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatLabel}>Month Transactions</Text>
                  <Text style={styles.heroStatValue}>
                    {monthTransactions.length} Items
                  </Text>
                </View>
              </View>
            </View>

            {/* Month-Wise Category Cards */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>
                  {selectedMonth} Spending by Category
                </Text>
                <Text style={styles.sectionSub}>
                  Compare real-time expenditures against category budget limits
                </Text>
              </View>
            </View>

            {categories.map((cat) => {
              const isOverBudget = cat.spent > cat.budget;
              const statusColor = isOverBudget
                ? '#EF4444'
                : cat.percent > 75
                ? '#F59E0B'
                : '#10B981';

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => handleOpenDetails(cat)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardHeaderLeft}>
                      <View
                        style={[
                          styles.catIconCircle,
                          { backgroundColor: cat.bgColor || '#EFF6FF' },
                        ]}
                      >
                        <Text style={styles.catIcon}>{cat.icon}</Text>
                      </View>
                      <View>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <Text style={styles.catMeta}>
                          {cat.transactionCount} transactions in {selectedMonth}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <Text style={styles.spentAmount}>
                        ₹{Number(cat.spent || 0).toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.budgetAmount}>
                        Limit: ₹{Number(cat.budget).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.catProgressBg}>
                    <View
                      style={[
                        styles.catProgressFill,
                        {
                          width: `${Math.min(100, cat.percent || 0)}%`,
                          backgroundColor: statusColor,
                        },
                      ]}
                    />
                  </View>

                  {/* Card Footer */}
                  <View style={styles.cardFooterRow}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {isOverBudget
                        ? '⚠️ Over Budget'
                        : `${cat.percent}% spent • ₹${(cat.remaining || 0).toLocaleString('en-IN')} remaining`}
                    </Text>
                    <Text style={styles.viewDetailsText}>Category Details →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Drilldown Hint Card */}
        <View style={styles.hintCard}>
          <Text style={styles.hintIcon}>ℹ️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.hintTitle}>Category Details Screen</Text>
            <Text style={styles.hintText}>
              Tap on any category above to open the dedicated Category Details Screen with complete transaction drilldown and budget update capabilities.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Fitness, Subscriptions, Pet Care"
                value={newCatName}
                onChangeText={setNewCatName}
              />

              <Text style={styles.inputLabel}>Monthly Budget Limit (₹) *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 5000"
                keyboardType="numeric"
                value={newCatBudget}
                onChangeText={setNewCatBudget}
              />

              <Text style={styles.inputLabel}>Choose Category Icon</Text>
              <View style={styles.iconPickerRow}>
                {['🏷️', '🍔', '🚗', '🛍️', '💡', '🎬', '🏥', '📚', '☕', '✈️', '🎮', '🏋️'].map(
                  (ic) => (
                    <TouchableOpacity
                      key={ic}
                      style={[
                        styles.iconChoice,
                        newCatIcon === ic && styles.iconChoiceActive,
                      ]}
                      onPress={() => setNewCatIcon(ic)}
                    >
                      <Text style={styles.iconChoiceText}>{ic}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Brief category description..."
                value={newCatDesc}
                onChangeText={setNewCatDesc}
              />

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleCreateCategory}
              >
                <Text style={styles.modalSaveBtnText}>Create Category</Text>
              </TouchableOpacity>
            </ScrollView>
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
  adminBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  adminBannerText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#0A192F',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroTag: {
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.3)',
  },
  heroTagText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCatCount: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  heroDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  addCategoryBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
    elevation: 2,
  },
  addCategoryBtnIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  addCategoryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  catIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIcon: {
    fontSize: 20,
  },
  catName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  catMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  budgetAmountLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  budgetAmountVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 1,
  },
  spentAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  budgetAmount: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  catProgressBg: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  shareBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shareBadgeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewDetailsText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  monthSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthSelectorTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 10,
  },
  monthScroll: {
    gap: 8,
  },
  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  monthPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  hintCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  hintIcon: {
    fontSize: 18,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  hintText: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  modalClose: {
    fontSize: 18,
    color: '#64748B',
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A192F',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#0A192F',
  },
  iconPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  iconChoice: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconChoiceActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  iconChoiceText: {
    fontSize: 20,
  },
  modalSaveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
