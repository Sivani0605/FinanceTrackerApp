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

export default function TransactionsScreen() {
  const {
    user,
    role,
    selectedMonth,
    setSelectedMonth,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    financialSummary,
    recentAlerts,
    isAuthenticated,
  } = useFinance();

  if (!isAuthenticated) {
    return <AuthGate screenTitle="Month-wise Transactions" />;
  }

  if (role === 'Admin') {
    return <CustomerOnlyGate screenTitle="Transactions Screen (Customer Only)" />;
  }

  // Filter Type
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'income', 'expense'

  // Add / Edit Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Food & Groceries');
  const [txType, setTxType] = useState('expense'); // 'income' | 'expense'
  const [txPaymentMethod, setTxPaymentMethod] = useState('UPI');
  const [txNotes, setTxNotes] = useState('');

  // Filter transactions for selected month and type
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth = t.month === selectedMonth;
      const matchType = filterType === 'ALL' ? true : t.type === filterType;
      return matchMonth && matchType;
    });
  }, [transactions, selectedMonth, filterType]);

  const openAddModal = () => {
    setEditingTxId(null);
    setTxTitle('');
    setTxAmount('');
    setTxCategory('Food & Groceries');
    setTxType('expense');
    setTxPaymentMethod('UPI');
    setTxNotes('');
    setModalVisible(true);
  };

  const openEditModal = (tx) => {
    setEditingTxId(tx.id);
    setTxTitle(tx.title);
    setTxAmount(String(tx.amount));
    setTxCategory(tx.category);
    setTxType(tx.type);
    setTxPaymentMethod(tx.paymentMethod || 'UPI');
    setTxNotes(tx.notes || '');
    setModalVisible(true);
  };

  const handleSaveTransaction = () => {
    // Form validation
    if (!txTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a transaction title/description.');
      return;
    }

    const numAmount = Number(txAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Validation Error', 'Amount must be a positive number greater than 0.');
      return;
    }

    if (editingTxId) {
      // Update transaction (triggers personalized alert)
      updateTransaction(editingTxId, {
        title: txTitle.trim(),
        amount: numAmount,
        category: txCategory,
        type: txType,
        paymentMethod: txPaymentMethod,
        notes: txNotes.trim(),
      });
    } else {
      // Add transaction (triggers personalized alert)
      addTransaction({
        title: txTitle.trim(),
        amount: numAmount,
        category: txCategory,
        type: txType,
        paymentMethod: txPaymentMethod,
        notes: txNotes.trim(),
        month: selectedMonth,
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (tx) => {
    deleteTransaction(tx.id);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Transactions"
        subtitle={`${selectedMonth} • ${currentMonthTransactions.length} items`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Only Notice if in Admin Mode */}
        {role === 'Admin' && (
          <View style={styles.adminBanner}>
            <Text style={styles.adminBannerText}>
              👑 Admin Mode: Viewing customer records for {user.name}
            </Text>
          </View>
        )}

        {/* Personalized Alert Feed Banner (Part-III (ii)) */}
        {recentAlerts.length > 0 && (
          <View style={styles.alertNotificationCard}>
            <View style={styles.alertNotificationHeader}>
              <Text style={styles.alertBell}>🔔</Text>
              <Text style={styles.alertCardTitle}>Personalized Transaction Alert</Text>
              <Text style={styles.alertCardTime}>{recentAlerts[0].time}</Text>
            </View>
            <Text style={styles.alertCardMessage}>{recentAlerts[0].message}</Text>
          </View>
        )}

        {/* Month-wise Period Filter */}
        <View style={styles.monthScrollContainer}>
          <Text style={styles.filterSectionLabel}>SELECT MONTH (Month-wise):</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthPillRow}
          >
            {MONTH_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthPill,
                  selectedMonth === m && styles.monthPillActive,
                ]}
                onPress={() => setSelectedMonth(m)}
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

        {/* Month Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Month Income</Text>
            <Text style={styles.incomeVal}>
              + ₹{financialSummary.income.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Month Expenses</Text>
            <Text style={styles.expenseVal}>
              - ₹{financialSummary.expense.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Net Balance</Text>
            <Text style={styles.balanceVal}>
              ₹{financialSummary.balance.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Type Filter Buttons */}
        <View style={styles.searchFilterCard}>
          <View style={styles.typeFilterRow}>
            {['ALL', 'income', 'expense'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeFilterBtn,
                  filterType === t && styles.typeFilterBtnActive,
                ]}
                onPress={() => setFilterType(t)}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    filterType === t && styles.typeFilterTextActive,
                  ]}
                >
                  {t === 'ALL'
                    ? 'All'
                    : t === 'income'
                    ? '↗ Income'
                    : '↘ Expenses'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Transaction Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonIcon}>➕</Text>
          <Text style={styles.addButtonText}>Add New Transaction</Text>
        </TouchableOpacity>

        {/* Transactions List */}
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>
            Transactions for {selectedMonth} ({currentMonthTransactions.length})
          </Text>

          {currentMonthTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySub}>
                Tap &ldquo;Add New Transaction&rdquo; above to record an income or expense.
              </Text>
            </View>
          ) : (
            currentMonthTransactions.map((tx) => (
              <View key={tx.id} style={styles.txItemCard}>
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
                    <Text
                      style={[
                        styles.txArrow,
                        {
                          color:
                            tx.type === 'income' ? '#10B981' : '#EF4444',
                        },
                      ]}
                    >
                      {tx.type === 'income' ? '↗' : '↘'}
                    </Text>
                  </View>

                  <View style={styles.txTextCol}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txMeta}>
                      {tx.category} • {tx.paymentMethod} • {tx.date}
                    </Text>
                    {tx.notes ? (
                      <Text style={styles.txNotes} numberOfLines={1}>
                        &ldquo;{tx.notes}&rdquo;
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmountText,
                      tx.type === 'income' ? styles.txIncome : styles.txExpense,
                    ]}
                  >
                    {tx.type === 'income' ? '+' : '-'} ₹
                    {Number(tx.amount).toLocaleString('en-IN')}
                  </Text>

                  {/* Actions: Edit & Delete with Personalized Alert */}
                  <View style={styles.txActionRow}>
                    <TouchableOpacity
                      style={styles.actionBtnEdit}
                      onPress={() => openEditModal(tx)}
                    >
                      <Text style={styles.actionBtnEditText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnDelete}
                      onPress={() => handleDelete(tx)}
                    >
                      <Text style={styles.actionBtnDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add / Edit Transaction Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTxId ? 'Edit Transaction' : 'Record New Transaction'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Toggle: Income vs Expense */}
              <Text style={styles.inputLabel}>Transaction Type</Text>
              <View style={styles.modalTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.modalTypeBtn,
                    txType === 'expense' && styles.modalTypeBtnActiveExpense,
                  ]}
                  onPress={() => setTxType('expense')}
                >
                  <Text
                    style={[
                      styles.modalTypeBtnText,
                      txType === 'expense' && styles.modalTypeBtnTextActive,
                    ]}
                  >
                    ↘ Expense
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalTypeBtn,
                    txType === 'income' && styles.modalTypeBtnActiveIncome,
                  ]}
                  onPress={() => setTxType('income')}
                >
                  <Text
                    style={[
                      styles.modalTypeBtnText,
                      txType === 'income' && styles.modalTypeBtnTextActive,
                    ]}
                  >
                    ↗ Income
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <Text style={styles.inputLabel}>Title / Description *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Supermarket Provisions, Fuel, Freelance"
                value={txTitle}
                onChangeText={setTxTitle}
              />

              {/* Amount Input */}
              <Text style={styles.inputLabel}>Amount (₹) *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 1500"
                keyboardType="numeric"
                value={txAmount}
                onChangeText={setTxAmount}
              />

              {/* Category Selection */}
              <Text style={styles.inputLabel}>Select Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryPillScroll}
              >
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.modalCatPill,
                      txCategory === c.name && styles.modalCatPillActive,
                    ]}
                    onPress={() => setTxCategory(c.name)}
                  >
                    <Text style={styles.modalCatIcon}>{c.icon}</Text>
                    <Text
                      style={[
                        styles.modalCatText,
                        txCategory === c.name && styles.modalCatTextActive,
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Payment Method */}
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.methodRow}>
                {['UPI', 'Card', 'Bank Transfer', 'Cash'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.methodPill,
                      txPaymentMethod === m && styles.methodPillActive,
                    ]}
                    onPress={() => setTxPaymentMethod(m)}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        txPaymentMethod === m && styles.methodTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                placeholder="Optional notes or reference number..."
                multiline
                value={txNotes}
                onChangeText={setTxNotes}
              />



              {/* Submit Button */}
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveTransaction}
              >
                <Text style={styles.modalSaveBtnText}>
                  {editingTxId ? 'Update Transaction' : 'Save Transaction'}
                </Text>
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
    paddingBottom: 36,
  },
  adminBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  adminBannerText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  alertNotificationCard: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  alertNotificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertBell: {
    fontSize: 14,
  },
  alertCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
    flex: 1,
  },
  alertCardTime: {
    fontSize: 10,
    color: '#2563EB',
  },
  alertCardMessage: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  monthScrollContainer: {
    marginBottom: 14,
  },
  monthPillRow: {
    gap: 8,
  },
  monthPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  monthPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A192F',
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryCol: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  incomeVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 2,
  },
  expenseVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 2,
  },
  balanceVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A192F',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  searchFilterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0A192F',
    marginBottom: 10,
  },
  typeFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeFilterBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  typeFilterBtnActive: {
    backgroundColor: '#2563EB',
  },
  typeFilterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  typeFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addButton: {
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
  addButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listSection: {
    marginTop: 4,
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 10,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A192F',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  txItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txTextCol: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  txMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  txNotes: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 1,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  txAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txIncome: {
    color: '#10B981',
  },
  txExpense: {
    color: '#EF4444',
  },
  txActionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  actionBtnEdit: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  actionBtnEditText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },
  actionBtnDelete: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  actionBtnDeleteText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '700',
  },
  // Modal Styles
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
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A192F',
    marginTop: 12,
    marginBottom: 6,
  },
  modalTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTypeBtnActiveExpense: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  modalTypeBtnActiveIncome: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  modalTypeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalTypeBtnTextActive: {
    color: '#0A192F',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0A192F',
  },
  categoryPillScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  modalCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalCatPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  modalCatIcon: {
    fontSize: 13,
  },
  modalCatText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0A192F',
  },
  modalCatTextActive: {
    color: '#FFFFFF',
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  methodText: {
    fontSize: 11,
    color: '#0A192F',
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#FFFFFF',
  },
  modalSaveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    elevation: 2,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

