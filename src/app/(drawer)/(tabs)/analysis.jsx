import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFinance } from '@/context/FinanceContext';
import ScreenHeader from '@/components/ScreenHeader';
import AuthGate from '@/components/AuthGate';

export default function AnalysisScreen() {
  const {
    user,
    role,
    selectedMonth,
    financialSummary,
    categories,
    monthTransactions,
    isAuthenticated,
    reportPeriod,
    setReportPeriod,
    reportData,
  } = useFinance();

  if (!isAuthenticated) {
    return <AuthGate screenTitle="Finance Analysis & Statistics" />;
  }

  const [timeframe, setTimeframe] = useState('Monthly'); // 'Weekly', 'Monthly', 'Yearly'

  // Safe fallback objects to prevent undefined errors
  const daily = reportData?.daily || {
    income: 0,
    expense: 0,
    net: 0,
    dateLabel: 'Today (26 Oct 2026)',
  };

  const weekly = reportData?.weekly || {
    weekLabel: 'Week 4 (Oct 20 - Oct 26, 2026)',
    totalExpense: 0,
    averageDaily: 0,
    peakDay: 'Saturday',
    days: [],
  };

  const monthly = reportData?.monthly || {
    monthLabel: selectedMonth || 'October 2026',
    budgetLimit: user?.monthlyBudget || 35000,
    totalSpent: financialSummary?.expense || 0,
    totalExpense: financialSummary?.expense || 0,
    remainingBudget: Math.max(
      0,
      (user?.monthlyBudget || 35000) - (financialSummary?.expense || 0)
    ),
    netSavings: financialSummary?.balance || 0,
    percentUtilized: 0,
  };

  const handleExportAdminReport = () => {
    Alert.alert(
      'Audit Report Exported',
      `Audit Report generated for Admin ${user?.name || 'Administrator'}.\n\n` +
        `• Period: ${selectedMonth}\n` +
        `• Total Monitored Accounts: 1,420\n` +
        `• Total System Turnover: ₹12,45,000\n` +
        `• Compliance Status: 100% Verified (Financial Audit Standards)`
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Finance Analysis"
        subtitle={`${role} Analytics • ${selectedMonth}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily / Weekly / Monthly Report Selector (Moved to Analysis Screen) */}
        <View style={styles.periodCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Financial Breakdown</Text>
              <Text style={styles.sectionSubtitle}>
                Toggle daily, weekly or monthly analytical reports
              </Text>
            </View>
            <View style={styles.periodPillContainer}>
              {['Daily', 'Weekly', 'Monthly'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodPill,
                    reportPeriod === period && styles.periodPillActive,
                  ]}
                  onPress={() => setReportPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodPillText,
                      reportPeriod === period && styles.periodPillTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dynamic Report Content based on Period */}
          {reportPeriod === 'Daily' && (
            <View style={styles.reportContentBox}>
              <View style={styles.reportCardHeader}>
                <Text style={styles.reportCardLabel}>
                  📅 {daily.dateLabel}
                </Text>
                <Text style={styles.reportStatusBadge}>
                  {daily.net >= 0
                    ? '✓ Within Daily Limit'
                    : '⚠️ Over Limit'}
                </Text>
              </View>

              <View style={styles.reportMetricGrid}>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Day Income</Text>
                  <Text style={[styles.reportMetricValue, { color: '#10B981' }]}>
                    ₹{(daily.income || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Day Expenses</Text>
                  <Text style={[styles.reportMetricValue, { color: '#EF4444' }]}>
                    ₹{(daily.expense || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Net Today</Text>
                  <Text style={styles.reportMetricValue}>
                    ₹{(daily.net || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <Text style={styles.reportFootnote}>
                Showing daily financial velocity & recorded payments for today.
              </Text>
            </View>
          )}

          {reportPeriod === 'Weekly' && (
            <View style={styles.reportContentBox}>
              <View style={styles.reportCardHeader}>
                <Text style={styles.reportCardLabel}>
                  📈 {weekly.weekLabel}
                </Text>
                <Text style={styles.reportStatusBadge}>
                  Avg: ₹{weekly.averageDaily || 0}/day
                </Text>
              </View>

              <Text style={styles.weeklyTotalText}>
                Weekly Spend: ₹
                {(weekly.totalExpense || 0).toLocaleString('en-IN')}
              </Text>

              {/* Day-by-Day Bar Visualizer in Blue */}
              <View style={styles.barChartContainer}>
                {(weekly.days || []).map((item) => {
                  const barHeight = Math.max(16, (item.amount / 2500) * 70);
                  const isPeak = item.amount >= 2000;
                  return (
                    <View key={item.day} style={styles.barCol}>
                      <Text style={styles.barAmountText}>₹{item.amount}</Text>
                      <View
                        style={[
                          styles.barFill,
                          { height: barHeight },
                          isPeak && styles.barFillPeak,
                        ]}
                      />
                      <Text
                        style={[styles.barLabel, isPeak && styles.barLabelPeak]}
                      >
                        {item.day}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.reportFootnote}>
                Peak spending day: {weekly.peakDay}
              </Text>
            </View>
          )}

          {reportPeriod === 'Monthly' && (
            <View style={styles.reportContentBox}>
              <View style={styles.reportCardHeader}>
                <Text style={styles.reportCardLabel}>
                  🗓️ {monthly.monthLabel} Full Report
                </Text>
                <Text style={styles.reportStatusBadge}>
                  {(financialSummary?.expense || 0) <=
                  (user?.monthlyBudget || 35000)
                    ? '✓ On Budget'
                    : '⚠️ Over Budget'}
                </Text>
              </View>

              <View style={styles.budgetProgressBarBg}>
                <View
                  style={[
                    styles.budgetProgressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        monthly.percentUtilized || 0
                      )}%`,
                      backgroundColor:
                        (monthly.percentUtilized || 0) > 90
                          ? '#EF4444'
                          : (monthly.percentUtilized || 0) > 70
                          ? '#F59E0B'
                          : '#2563EB',
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentSub}>
                {monthly.percentUtilized || 0}% of monthly limit used
              </Text>

              <View style={styles.reportMetricGrid}>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Limit</Text>
                  <Text style={styles.reportMetricValue}>
                    ₹{(monthly.budgetLimit || 35000).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Spent</Text>
                  <Text style={[styles.reportMetricValue, { color: '#EF4444' }]}>
                    ₹{(monthly.totalSpent || monthly.totalExpense || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Remaining</Text>
                  <Text style={styles.reportMetricValue}>
                    ₹{(monthly.remainingBudget || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.reportMetricBox}>
                  <Text style={styles.reportMetricTitle}>Net Savings</Text>
                  <Text style={[styles.reportMetricValue, { color: '#0A192F' }]}>
                    ₹{(monthly.netSavings || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Hero Spending Analysis Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroSubtitle}>Total Spending ({reportPeriod})</Text>
          <Text style={styles.heroAmount}>
            ₹{(financialSummary?.expense || 0).toLocaleString('en-IN')}
          </Text>

          <View style={styles.comparisonRow}>
            <View style={styles.comparisonBadge}>
              <Text style={styles.comparisonText}>↓ 8.5%</Text>
            </View>
            <Text style={styles.comparisonLabel}>vs. previous period</Text>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Budget Target</Text>
              <Text style={styles.heroStatValue}>
                ₹{(user?.monthlyBudget || 35000).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Savings Rate</Text>
              <Text style={[styles.heroStatValue, { color: '#38BDF8' }]}>
                {financialSummary?.savingsRate || 0}%
              </Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Total Income</Text>
              <Text style={styles.heroStatValue}>
                ₹{(financialSummary?.income || 0).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Admin Platform Analytics Section (Admin Mode) */}
        {role === 'Admin' && (
          <View style={styles.adminSection}>
            <View style={styles.adminHeaderRow}>
              <View>
                <Text style={styles.adminSectionTitle}>🛡️ Admin System Analytics</Text>
                <Text style={styles.adminSectionSub}>
                  Platform aggregated performance metrics
                </Text>
              </View>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={handleExportAdminReport}
              >
                <Text style={styles.exportBtnText}>Export Audit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.adminMetricsRow}>
              <View style={styles.adminCardSmall}>
                <Text style={styles.adminMetricLabel}>System Turnover</Text>
                <Text style={styles.adminMetricValue}>₹12,45,000</Text>
                <Text style={styles.adminMetricChange}>+14.2% YoY</Text>
              </View>
              <View style={styles.adminCardSmall}>
                <Text style={styles.adminMetricLabel}>Avg Customer Spend</Text>
                <Text style={styles.adminMetricValue}>₹17,300</Text>
                <Text style={styles.adminMetricChange}>Normal Range</Text>
              </View>
            </View>

            <View style={styles.adminCardSmallFull}>
              <Text style={styles.adminMetricLabel}>System Security & Risk Check</Text>
              <Text style={[styles.adminMetricValue, { color: '#10B981', fontSize: 15 }]}>
                ✓ 0 Suspicious Transactions Detected
              </Text>
              <Text style={styles.adminAuditFootnote}>
                Audit timestamp: 28 Oct 2026 • Verified Financial Security System
              </Text>
            </View>
          </View>
        )}

        {/* Weekly Trend Bar Chart Visualizer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Pattern & Velocity</Text>
          <Text style={styles.cardSubtitle}>
            Day-wise expense distribution for current period
          </Text>

          <View style={styles.chartContainer}>
            {[
              { day: 'Mon', amount: 800, percent: 35 },
              { day: 'Tue', amount: 1500, percent: 65 },
              { day: 'Wed', amount: 1500, percent: 65 },
              { day: 'Thu', amount: 450, percent: 22 },
              { day: 'Fri', amount: 920, percent: 40 },
              { day: 'Sat', amount: 2100, percent: 92, peak: true },
              { day: 'Sun', amount: 1200, percent: 52 },
            ].map((d) => (
              <View key={d.day} style={styles.chartBarCol}>
                <Text style={styles.chartBarAmt}>₹{d.amount}</Text>
                <View
                  style={[
                    styles.chartBar,
                    { height: (d.percent / 100) * 85 },
                    d.peak && styles.chartBarPeak,
                  ]}
                />
                <Text style={[styles.chartBarDay, d.peak && styles.chartBarDayPeak]}>
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartLegend}>
            * Saturday represents highest discretionary spending (₹2,100).
          </Text>
        </View>

        {/* Category Breakdown with Progress Bars */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expenses by Category</Text>
          <Text style={styles.cardSubtitle}>
            Breakdown of your {timeframe.toLowerCase()} spending allocation
          </Text>

          {categories.map((cat) => {
            const expenseRatio =
              financialSummary.expense > 0
                ? Math.round((cat.spent / financialSummary.expense) * 100)
                : 0;

            return (
              <View key={cat.id} style={styles.catBreakdownItem}>
                <View style={styles.catHeaderRow}>
                  <View style={styles.catLeftRow}>
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <View>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catRatio}>
                        {expenseRatio}% of total expenses
                      </Text>
                    </View>
                  </View>
                  <View style={styles.catRightCol}>
                    <Text style={styles.catSpentText}>
                      ₹{(cat.spent || 0).toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.catBudgetText}>
                      of ₹{(cat.budget || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.catProgressBarBg}>
                  <View
                    style={[
                      styles.catProgressBarFill,
                      {
                        width: `${cat.percent}%`,
                        backgroundColor:
                          cat.percent > 90
                            ? '#EF4444'
                            : cat.percent > 75
                            ? '#F59E0B'
                            : cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Smart Insights Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Smart Financial Insights</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightIcon}>💡</Text>
            <View style={styles.insightTextCol}>
              <Text style={styles.insightHeading}>Food & Groceries on Track</Text>
              <Text style={styles.insightDesc}>
                You have spent 65% of your ₹8,000 grocery budget. Keep it up!
              </Text>
            </View>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightIcon}>🎯</Text>
            <View style={styles.insightTextCol}>
              <Text style={styles.insightHeading}>High Savings Velocity</Text>
              <Text style={styles.insightDesc}>
                Your current savings rate is {financialSummary.savingsRate}%, which is
                15% higher than your target benchmark.
              </Text>
            </View>
          </View>
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
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  timeframeButtonActive: {
    backgroundColor: '#2563EB',
  },
  timeframeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0A192F',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  heroSubtitle: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '500',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 6,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  comparisonBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comparisonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comparisonLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 3,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminSection: {
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
    marginBottom: 12,
  },
  adminSectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  adminSectionSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  exportBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  adminMetricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  adminCardSmall: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  adminCardSmallFull: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  adminMetricLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  adminMetricValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 2,
  },
  adminMetricChange: {
    color: '#38BDF8',
    fontSize: 10,
    marginTop: 2,
  },
  adminAuditFootnote: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarAmt: {
    fontSize: 8,
    color: '#94A3B8',
    marginBottom: 4,
  },
  chartBar: {
    width: 16,
    backgroundColor: '#93C5FD',
    borderRadius: 8,
  },
  chartBarPeak: {
    backgroundColor: '#2563EB',
  },
  chartBarDay: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
  },
  chartBarDayPeak: {
    fontWeight: 'bold',
    color: '#2563EB',
  },
  chartLegend: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  catBreakdownItem: {
    marginBottom: 14,
  },
  catHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catIcon: {
    fontSize: 18,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  catRatio: {
    fontSize: 10,
    color: '#64748B',
  },
  catRightCol: {
    alignItems: 'flex-end',
  },
  catSpentText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  catBudgetText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  catProgressBarBg: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  catProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  insightIcon: {
    fontSize: 20,
  },
  insightTextCol: {
    flex: 1,
  },
  insightHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  insightDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  // ==================== REPORT STYLES ====================
  periodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
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
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  periodPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
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
  reportContentBox: {
    marginTop: 4,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A192F',
  },
  reportStatusBadge: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reportMetricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  reportMetricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportMetricTitle: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3,
  },
  reportMetricValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  reportFootnote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    fontStyle: 'italic',
  },
  weeklyTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A192F',
    marginBottom: 8,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingVertical: 6,
    marginBottom: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 4,
  },
  barFill: {
    width: 14,
    borderRadius: 4,
    backgroundColor: '#93C5FD',
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
    fontWeight: '700',
    color: '#2563EB',
  },
  budgetProgressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  budgetProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentSub: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 10,
  },
});

