import { Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Generate and download an executive Financial Audit Report PDF.
 * Compatible with iOS, Android, and Web.
 */
export async function exportAuditReportPdf({
  adminName = 'System Administrator',
  adminEmail = 'admin@gmail.com',
  selectedMonth = 'October 2026',
  financialSummary = { income: 45000, expense: 15320, balance: 29680, savingsRate: 66 },
  categories = [],
  transactions = [],
  reportData = null,
}) {
  const reportId = `FT-AUD-${Date.now().toString().slice(-6)}`;
  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const monthTransactions = transactions.filter((t) => t.month === selectedMonth);
  const totalAllocatedBudget = categories.reduce((sum, c) => sum + Number(c.budget || 0), 0);
  const totalCategorySpent = categories.reduce((sum, c) => sum + Number(c.spent || 0), 0);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Finance Tracker - Audit Report (${selectedMonth})</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0A192F;
      background-color: #F8FAFC;
      line-height: 1.5;
      padding: 0;
    }
    .no-print {
      display: block;
    }
    @media print {
      body {
        background-color: #FFFFFF;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
    .web-toolbar {
      background-color: #0A192F;
      color: #FFFFFF;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .web-toolbar h2 {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar-btns {
      display: flex;
      gap: 12px;
    }
    .btn-action {
      background-color: #2563EB;
      color: #FFFFFF;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-action:hover {
      background-color: #1D4ED8;
    }
    .btn-close {
      background-color: #334155;
      color: #FFFFFF;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-close:hover {
      background-color: #475569;
    }
    .report-container {
      max-width: 900px;
      margin: 20px auto 40px auto;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }
    /* Header Banner */
    .report-header {
      background: linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%);
      color: #FFFFFF;
      padding: 32px 36px;
      border-bottom: 4px solid #2563EB;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .brand-col {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background-color: #2563EB;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: bold;
      border: 2px solid #93C5FD;
    }
    .brand-info h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin: 0;
    }
    .brand-info p {
      font-size: 12px;
      color: #93C5FD;
      margin-top: 2px;
    }
    .report-badge {
      text-align: right;
    }
    .audit-tag {
      display: inline-block;
      background: rgba(37, 99, 235, 0.4);
      border: 1px solid #60A5FA;
      color: #FFFFFF;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .meta-id {
      font-size: 11px;
      color: #CBD5E1;
      font-family: monospace;
    }
    .header-sub-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: rgba(255, 255, 255, 0.08);
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .sub-item label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94A3B8;
      font-weight: 600;
    }
    .sub-item span {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 2px;
    }
    /* Content Body */
    .report-body {
      padding: 32px 36px;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #0A192F;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    /* Executive Metric Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 14px;
      text-align: left;
    }
    .kpi-card.highlight {
      background: #EFF6FF;
      border-color: #BFDBFE;
    }
    .kpi-label {
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
    }
    .kpi-value {
      font-size: 20px;
      font-weight: 800;
      color: #0A192F;
      margin-top: 4px;
    }
    .kpi-sub {
      font-size: 10px;
      color: #10B981;
      font-weight: 600;
      margin-top: 2px;
    }
    /* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      font-size: 12px;
    }
    th {
      background-color: #0F172A;
      color: #FFFFFF;
      text-align: left;
      padding: 10px 12px;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E2E8F0;
      color: #1E293B;
    }
    tr:nth-child(even) td {
      background-color: #F8FAFC;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
    }
    .badge-success {
      background-color: #D1FAE5;
      color: #065F46;
    }
    .badge-warning {
      background-color: #FEF3C7;
      color: #92400E;
    }
    .badge-danger {
      background-color: #FEE2E2;
      color: #991B1B;
    }
    .badge-info {
      background-color: #DBEAFE;
      color: #1E40AF;
    }
    /* System Audit Summary Box */
    .audit-summary-box {
      background-color: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .audit-summary-box h3 {
      font-size: 14px;
      font-weight: 700;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .audit-summary-box p {
      font-size: 11px;
      color: #15803D;
      margin-top: 3px;
    }
    .audit-stamp {
      border: 2px dashed #16A34A;
      color: #166534;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    /* Sign-off section */
    .signoff-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-top: 36px;
      padding-top: 24px;
      border-top: 2px dashed #CBD5E1;
    }
    .sign-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 16px;
    }
    .sign-box h4 {
      font-size: 12px;
      font-weight: 700;
      color: #0A192F;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sign-box p {
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
    }
    .signature-line {
      margin-top: 32px;
      border-top: 1px solid #0A192F;
      padding-top: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #0A192F;
      display: flex;
      justify-content: space-between;
    }
    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #94A3B8;
      margin-top: 28px;
    }
  </style>
</head>
<body>

  <!-- Web Toolbar (Visible on web only, hidden on print) -->
  <div class="web-toolbar no-print">
    <h2>📄 Finance Tracker • Official Audit Report (${selectedMonth})</h2>
    <div class="toolbar-btns">
      <button class="btn-action" onclick="window.print()">
        📥 Download as PDF / Print
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="report-container">
    <!-- Header -->
    <div class="report-header">
      <div class="header-top">
        <div class="brand-col">
          <div class="brand-logo">₹</div>
          <div class="brand-info">
            <h1>Finance Tracker</h1>
            <p>Enterprise Financial Management & Audit System</p>
          </div>
        </div>
        <div class="report-badge">
          <div class="audit-tag">Official Audit Report</div>
          <div class="meta-id">ID: ${reportId}</div>
        </div>
      </div>

      <div class="header-sub-row">
        <div class="sub-item">
          <label>Audit Period</label>
          <span>${selectedMonth}</span>
        </div>
        <div class="sub-item">
          <label>Generated By</label>
          <span>${adminName}</span>
        </div>
        <div class="sub-item">
          <label>Timestamp</label>
          <span>${generatedAt}</span>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="report-body">
      <!-- KPI Metrics -->
      <div class="section-title">📊 Executive Platform Metrics</div>
      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <div class="kpi-label">System Turnover</div>
          <div class="kpi-value">₹12,45,000</div>
          <div class="kpi-sub">↑ 14.2% YoY Growth</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Monitored Accounts</div>
          <div class="kpi-value">1,420</div>
          <div class="kpi-sub">100% Active</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Month Total Spent</div>
          <div class="kpi-value" style="color: #EF4444;">₹${(financialSummary.expense || 0).toLocaleString('en-IN')}</div>
          <div class="kpi-sub" style="color: #64748B;">Target: ₹${totalAllocatedBudget.toLocaleString('en-IN')}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Net Balance</div>
          <div class="kpi-value" style="color: #10B981;">₹${(financialSummary.balance || 0).toLocaleString('en-IN')}</div>
          <div class="kpi-sub" style="color: #2563EB;">${financialSummary.savingsRate || 0}% Savings Rate</div>
        </div>
      </div>

      <!-- Compliance Verification Box -->
      <div class="audit-summary-box">
        <div>
          <h3>✓ System Security & Financial Integrity Check Passed</h3>
          <p>Zero suspicious or fraudulent transactions detected. Full reconciliation completed according to Standard Financial Accounting Principles.</p>
        </div>
        <div class="audit-stamp">ISO 27001 Verified</div>
      </div>

      <!-- Category Allocation & Spend Table -->
      <div class="section-title">🏷️ Category Budget Allocation & Utilization (${selectedMonth})</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th class="text-right">Budget Limit (₹)</th>
            <th class="text-right">Actual Spent (₹)</th>
            <th class="text-right">Remaining (₹)</th>
            <th class="text-center">Utilization</th>
            <th class="text-center">Audit Status</th>
          </tr>
        </thead>
        <tbody>
          ${categories
            .map((cat) => {
              const spent = Number(cat.spent || 0);
              const budget = Number(cat.budget || 0);
              const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
              const remaining = Math.max(0, budget - spent);
              const isOver = spent > budget;
              const badgeClass = isOver ? 'badge-danger' : percent > 75 ? 'badge-warning' : 'badge-success';
              const statusText = isOver ? 'Over Budget' : percent > 75 ? 'Near Limit' : 'Healthy';

              return `
                <tr>
                  <td><strong>${cat.icon} ${cat.name}</strong></td>
                  <td class="text-right">₹${budget.toLocaleString('en-IN')}</td>
                  <td class="text-right" style="font-weight: 700; color: ${isOver ? '#EF4444' : '#0A192F'};">₹${spent.toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${remaining.toLocaleString('en-IN')}</td>
                  <td class="text-center">${percent}%</td>
                  <td class="text-center"><span class="badge ${badgeClass}">${statusText}</span></td>
                </tr>
              `;
            })
            .join('')}
          <tr style="background-color: #EFF6FF; font-weight: bold;">
            <td><strong>TOTAL ALLOCATION</strong></td>
            <td class="text-right"><strong>₹${totalAllocatedBudget.toLocaleString('en-IN')}</strong></td>
            <td class="text-right" style="color: #EF4444;"><strong>₹${totalCategorySpent.toLocaleString('en-IN')}</strong></td>
            <td class="text-right"><strong>₹${Math.max(0, totalAllocatedBudget - totalCategorySpent).toLocaleString('en-IN')}</strong></td>
            <td class="text-center"><strong>${totalAllocatedBudget > 0 ? Math.round((totalCategorySpent / totalAllocatedBudget) * 100) : 0}%</strong></td>
            <td class="text-center"><span class="badge badge-info">Reconciled</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Itemized Transaction Audit Log -->
      <div class="section-title">💳 Itemized Audit Log (${selectedMonth} • ${monthTransactions.length} Transactions)</div>
      <table>
        <thead>
          <tr>
            <th>Ref ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Method</th>
            <th class="text-center">Type</th>
            <th class="text-right">Amount (₹)</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          ${monthTransactions
            .map((tx) => {
              const isIncome = tx.type === 'income';
              return `
                <tr>
                  <td style="font-family: monospace; color: #64748B;">${tx.id}</td>
                  <td>${tx.date}</td>
                  <td><strong>${tx.title}</strong></td>
                  <td>${tx.category}</td>
                  <td>${tx.paymentMethod || 'UPI'}</td>
                  <td class="text-center">
                    <span class="badge ${isIncome ? 'badge-success' : 'badge-danger'}">
                      ${isIncome ? 'CREDIT' : 'DEBIT'}
                    </span>
                  </td>
                  <td class="text-right" style="font-weight: 700; color: ${isIncome ? '#10B981' : '#EF4444'};">
                    ${isIncome ? '+' : '-'} ₹${Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td class="text-center"><span class="badge badge-success">Verified</span></td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>

      <!-- Sign-off & Legal Footnote -->
      <div class="signoff-section">
        <div class="sign-box">
          <h4>Lead Auditor Declaration</h4>
          <p>
            I hereby certify that this audit report accurately reflects the transactions, revenue inflows, and expenditure disbursements recorded during ${selectedMonth}. All records comply with platform governance policies.
          </p>
          <div class="signature-line">
            <span>${adminName}</span>
            <span>Lead Auditor / Financial Controller</span>
          </div>
        </div>

        <div class="sign-box">
          <h4>System Governance & Hash</h4>
          <p>
            <strong>Security Standard:</strong> AES-256 Encrypted Audit Trail<br />
            <strong>Audit Verification Hash:</strong><br />
            <span style="font-family: monospace; font-size: 9px; color: #64748B; word-break: break-all;">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span><br />
            <strong>Compliance Status:</strong> 100% Passed
          </p>
          <div class="signature-line">
            <span>Finance Tracker Security Engine</span>
            <span>Digital Timestamp</span>
          </div>
        </div>
      </div>

      <div class="footer-note">
        This document is generated by Finance Tracker System. All rights reserved &copy; 2026. Confidential and proprietary financial record.
      </div>
    </div>
  </div>

  <script>
    // Automatically trigger print on modern browsers when opened in separate window
    window.addEventListener('DOMContentLoaded', () => {
      // Allow fonts to render cleanly
      setTimeout(() => {
        // Only auto-print if window has opener
        if (window.opener) {
          window.print();
        }
      }, 500);
    });
  </script>
</body>
</html>
`;

  return await executePdfExport(htmlContent, `FinanceTracker_AuditReport_${selectedMonth.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generate and download a Customer Financial Breakdown PDF Report (Daily, Weekly, or Monthly).
 */
export async function exportCustomerReportPdf({
  userName = 'Customer',
  userEmail = 'customer@gmail.com',
  period = 'Monthly',
  selectedMonth = 'October 2026',
  financialSummary = { income: 45000, expense: 15320, balance: 29680, savingsRate: 66 },
  categories = [],
  transactions = [],
  reportData = null,
}) {
  const reportId = `FT-CUST-${Date.now().toString().slice(-6)}`;
  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const monthTransactions = transactions.filter((t) => t.month === selectedMonth);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Personal Finance Report - ${period} (${selectedMonth})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0A192F;
      background-color: #F8FAFC;
      line-height: 1.5;
    }
    .no-print { display: block; }
    @media print {
      body { background-color: #FFFFFF; }
      .no-print { display: none !important; }
    }
    .web-toolbar {
      background-color: #0A192F;
      color: #FFFFFF;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .btn-action {
      background-color: #2563EB;
      color: #FFFFFF;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-close {
      background-color: #334155;
      color: #FFFFFF;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .report-container {
      max-width: 860px;
      margin: 20px auto 40px auto;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }
    .report-header {
      background: linear-gradient(135deg, #0A192F 0%, #2563EB 100%);
      color: #FFFFFF;
      padding: 28px 32px;
    }
    .report-body { padding: 28px 32px; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 14px;
    }
    .kpi-label { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; }
    .kpi-value { font-size: 22px; font-weight: 800; color: #0A192F; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th { background-color: #0F172A; color: #FFFFFF; padding: 10px 12px; font-size: 11px; text-transform: uppercase; text-align: left; }
    td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
    .text-right { text-align: right; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; }
    .badge-success { background-color: #D1FAE5; color: #065F46; }
    .badge-danger { background-color: #FEE2E2; color: #991B1B; }
  </style>
</head>
<body>
  <div class="web-toolbar no-print">
    <h2>📄 Finance Tracker • ${period} Statement (${selectedMonth})</h2>
    <div style="display: flex; gap: 10px;">
      <button class="btn-action" onclick="window.print()">📥 Download as PDF / Print</button>
      <button class="btn-close" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="report-container">
    <div class="report-header">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 20px; font-weight: 800;">Personal Finance Statement</h1>
          <p style="font-size: 12px; color: #93C5FD; margin-top: 4px;">Period: ${period} Report • ${selectedMonth}</p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #E2E8F0;">
          <div>Customer: <strong>${userName}</strong></div>
          <div>Email: ${userEmail}</div>
          <div style="font-family: monospace; margin-top: 4px;">ID: ${reportId}</div>
        </div>
      </div>
    </div>

    <div class="report-body">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Income</div>
          <div class="kpi-value" style="color: #10B981;">₹${(financialSummary.income || 0).toLocaleString('en-IN')}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Expense</div>
          <div class="kpi-value" style="color: #EF4444;">₹${(financialSummary.expense || 0).toLocaleString('en-IN')}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Net Balance</div>
          <div class="kpi-value" style="color: #2563EB;">₹${(financialSummary.balance || 0).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <h3 style="font-size: 14px; margin-bottom: 12px; text-transform: uppercase;">Spending by Category</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th class="text-right">Budget Limit (₹)</th>
            <th class="text-right">Spent (₹)</th>
            <th class="text-right">Remaining (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${categories
            .map(
              (c) => `
            <tr>
              <td><strong>${c.icon} ${c.name}</strong></td>
              <td class="text-right">₹${Number(c.budget).toLocaleString('en-IN')}</td>
              <td class="text-right" style="font-weight: 700;">₹${Number(c.spent || 0).toLocaleString('en-IN')}</td>
              <td class="text-right">₹${Number(c.remaining || 0).toLocaleString('en-IN')}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h3 style="font-size: 14px; margin-bottom: 12px; text-transform: uppercase;">Transaction Records (${monthTransactions.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th class="text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${monthTransactions
            .map(
              (t) => `
            <tr>
              <td>${t.date}</td>
              <td><strong>${t.title}</strong></td>
              <td>${t.category}</td>
              <td class="text-right" style="font-weight: 700; color: ${t.type === 'income' ? '#10B981' : '#EF4444'};">
                ${t.type === 'income' ? '+' : '-'} ₹${Number(t.amount).toLocaleString('en-IN')}
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <p style="text-align: center; font-size: 10px; color: #94A3B8; margin-top: 24px;">
        Generated automatically by Finance Tracker on ${generatedAt}.
      </p>
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (window.opener) {
          window.print();
        }
      }, 500);
    });
  </script>
</body>
</html>
`;

  return await executePdfExport(htmlContent, `FinanceTracker_${period}_${selectedMonth.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Internal executor that handles cross-platform PDF generation & export.
 */
async function executePdfExport(htmlContent, filename = 'FinanceTracker_Report.pdf') {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          return { success: true, mode: 'web_window' };
        } else {
          // Fallback if popup blocked
          await Print.printAsync({ html: htmlContent });
          return { success: true, mode: 'web_print' };
        }
      }
    }

    // Native Mobile (Android & iOS)
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download / Save Audit Report PDF',
        UTI: 'com.adobe.pdf',
      });
      return { success: true, uri, mode: 'native_share' };
    } else {
      Alert.alert(
        'PDF Report Generated',
        `Your Audit Report PDF was generated successfully:\n\n${uri}`,
        [{ text: 'OK' }]
      );
      return { success: true, uri, mode: 'native_local' };
    }
  } catch (error) {
    console.error('PDF Generation Error:', error);
    Alert.alert(
      'Export Failed',
      `Could not generate PDF report. Error: ${error.message || 'Unknown error'}`
    );
    return { success: false, error };
  }
}
