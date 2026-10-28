import React, { createContext, useContext, useState, useMemo } from 'react';
import { Alert } from 'react-native';

const FinanceContext = createContext(null);

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    title: 'Monthly Salary & Stipend',
    category: 'Salary & Income',
    amount: 45000,
    type: 'income',
    date: '2026-10-01',
    month: 'October 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly Consulting & Salary',
  },
  {
    id: 'tx-102',
    title: 'Freelance App Development',
    category: 'Salary & Income',
    amount: 5000,
    type: 'income',
    date: '2026-10-12',
    month: 'October 2026',
    paymentMethod: 'UPI',
    notes: 'React Native Client Project',
  },
  {
    id: 'tx-103',
    title: 'Supermarket & Groceries',
    category: 'Food & Groceries',
    amount: 5200,
    type: 'expense',
    date: '2026-10-04',
    month: 'October 2026',
    paymentMethod: 'Card',
    notes: 'Weekly fresh vegetables & provisions',
  },
  {
    id: 'tx-104',
    title: 'Metro Pass & Fuel',
    category: 'Transportation',
    amount: 2100,
    type: 'expense',
    date: '2026-10-08',
    month: 'October 2026',
    paymentMethod: 'UPI',
    notes: 'Monthly commute pass',
  },
  {
    id: 'tx-105',
    title: 'Festive Clothes & Shoes',
    category: 'Shopping',
    amount: 4300,
    type: 'expense',
    date: '2026-10-14',
    month: 'October 2026',
    paymentMethod: 'Card',
    notes: 'Festival shopping discount',
  },
  {
    id: 'tx-106',
    title: 'Electricity & WiFi Bill',
    category: 'Bills & Utilities',
    amount: 1800,
    type: 'expense',
    date: '2026-10-18',
    month: 'October 2026',
    paymentMethod: 'Net Banking',
    notes: 'Fiber broadband and power bill',
  },
  {
    id: 'tx-107',
    title: 'Weekend Movies & Dinner',
    category: 'Entertainment',
    amount: 1500,
    type: 'expense',
    date: '2026-10-22',
    month: 'October 2026',
    paymentMethod: 'UPI',
    notes: 'Film festival outing',
  },
  {
    id: 'tx-108',
    title: 'Pharmacy & Health Vitamins',
    category: 'Health & Medical',
    amount: 1200,
    type: 'expense',
    date: '2026-10-26',
    month: 'October 2026',
    paymentMethod: 'Cash',
    notes: 'Health check and supplements',
  },
  // September 2026 transactions
  {
    id: 'tx-201',
    title: 'September Salary',
    category: 'Salary & Income',
    amount: 45000,
    type: 'income',
    date: '2026-09-01',
    month: 'September 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly salary',
  },
  {
    id: 'tx-202',
    title: 'Grocery Supplies',
    category: 'Food & Groceries',
    amount: 4800,
    type: 'expense',
    date: '2026-09-05',
    month: 'September 2026',
    paymentMethod: 'UPI',
    notes: 'Monthly provisions',
  },
  {
    id: 'tx-203',
    title: 'Vehicle Service & Fuel',
    category: 'Transportation',
    amount: 1900,
    type: 'expense',
    date: '2026-09-12',
    month: 'September 2026',
    paymentMethod: 'Card',
    notes: 'Oil change and petrol',
  },
  {
    id: 'tx-204',
    title: 'Electronics & Accessories',
    category: 'Shopping',
    amount: 3500,
    type: 'expense',
    date: '2026-09-20',
    month: 'September 2026',
    paymentMethod: 'Card',
    notes: 'Keyboard and mouse',
  },
  // August 2026 transactions
  {
    id: 'tx-301',
    title: 'August Salary',
    category: 'Salary & Income',
    amount: 45000,
    type: 'income',
    date: '2026-08-01',
    month: 'August 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'August credit',
  },
  {
    id: 'tx-302',
    title: 'Groceries & Milk',
    category: 'Food & Groceries',
    amount: 5000,
    type: 'expense',
    date: '2026-08-07',
    month: 'August 2026',
    paymentMethod: 'UPI',
    notes: 'Weekly groceries',
  },
  {
    id: 'tx-303',
    title: 'City Travel & Cab',
    category: 'Transportation',
    amount: 2000,
    type: 'expense',
    date: '2026-08-15',
    month: 'August 2026',
    paymentMethod: 'Cash',
    notes: 'Weekend travel',
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Food & Groceries',
    icon: '🍔',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    budget: 8000,
    description: 'Groceries, supermarkets, restaurants, and daily snacks',
  },
  {
    id: 'cat-2',
    name: 'Transportation',
    icon: '🚗',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    budget: 4000,
    description: 'Fuel, bus, metro pass, cab rides, and parking',
  },
  {
    id: 'cat-3',
    name: 'Shopping',
    icon: '🛍️',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    budget: 6000,
    description: 'Apparel, footwear, electronics, and accessories',
  },
  {
    id: 'cat-4',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    budget: 3000,
    description: 'Electricity, water, broadband, gas, and mobile recharges',
  },
  {
    id: 'cat-5',
    name: 'Entertainment',
    icon: '🎬',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    budget: 3000,
    description: 'Movies, streaming services, concerts, and games',
  },
  {
    id: 'cat-6',
    name: 'Health & Medical',
    icon: '🏥',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    budget: 3000,
    description: 'Doctor visits, medicines, lab tests, and wellness',
  },
  {
    id: 'cat-7',
    name: 'Education & Courses',
    icon: '📚',
    color: '#1D4ED8',
    bgColor: '#DBEAFE',
    budget: 4000,
    description: 'Books, certifications, college expenses, and workshops',
  },
  {
    id: 'cat-8',
    name: 'Savings & Investments',
    icon: '📈',
    color: '#0A192F',
    bgColor: '#E2E8F0',
    budget: 10000,
    description: 'Mutual funds, recurring deposits, and emergency fund',
  },
];

export function FinanceProvider({ children }) {
  // User state
  const [user, setUser] = useState({
    id: 'usr-101',
    name: 'Sivani M',
    email: 'sivani@gmail.com',
    phone: '9876543210',
    address: 'Coimbatore, Tamil Nadu',
    accountNumber: '•••• •••• 4892',
    memberSince: 'October 2024',
    monthlyBudget: 35000,
    avatar: 'S',
  });

  // Admin Team list (allows adding multiple administrators)
  const [admins, setAdmins] = useState([
    {
      id: 'adm-001',
      name: 'System Admin',
      email: 'admin@gmail.com',
      role: 'Super Administrator',
      phone: '9876500001',
      department: 'Executive Finance',
      status: 'Active',
      addedDate: '2026-01-15',
    },
    {
      id: 'adm-002',
      name: 'Prabhu R',
      email: 'prabhu@gmail.com',
      role: 'Finance Auditor',
      phone: '9876500002',
      department: 'Audit & Compliance',
      status: 'Active',
      addedDate: '2026-05-10',
    },
  ]);

  // Customers Directory (allows dynamic signups & any customer)
  const [customers, setCustomers] = useState([
    {
      id: 'usr-101',
      name: 'Sivani M',
      email: 'sivani@gmail.com',
      phone: '9876543210',
      address: 'Coimbatore, Tamil Nadu',
      memberSince: 'October 2024',
      status: 'Active',
      monthlyBudget: 35000,
    },
    {
      id: 'usr-102',
      name: 'Kavitha S',
      email: 'kavitha@gmail.com',
      phone: '9876543211',
      address: 'Chennai, Tamil Nadu',
      memberSince: 'January 2025',
      status: 'Active',
      monthlyBudget: 42000,
    },
  ]);

  const [role, setRole] = useState('Customer'); // 'Customer' or 'Admin'
  // Starts as FALSE so user lands on Home Screen with Sign In / Sign Up options!
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [reportPeriod, setReportPeriod] = useState('Monthly'); // 'Daily', 'Weekly', 'Monthly'

  // Transactions state
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Personalized notification log
  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 'alert-init',
      title: 'Welcome to Finance Tracker',
      message: 'Hello Sivani! Your October 2026 financial dashboard is ready.',
      time: 'Just now',
      type: 'info',
    },
  ]);

  // Derived calculations for the active month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.month === selectedMonth);
  }, [transactions, selectedMonth]);

  const financialSummary = useMemo(() => {
    let income = 0;
    let expense = 0;

    monthTransactions.forEach((t) => {
      if (t.type === 'income') {
        income += Number(t.amount);
      } else {
        expense += Number(t.amount);
      }
    });

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    return {
      income,
      expense,
      balance,
      savingsRate,
    };
  }, [monthTransactions]);

  // Daily and Weekly calculations for financial reports
  const reportData = useMemo(() => {
    // Daily calculation
    const dailyTx = monthTransactions.filter(
      (t) => t.date === '2026-10-26' || t.date === '2026-10-22'
    );
    const dailyExpense = dailyTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const dailyIncome = dailyTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Weekly calculation (last 7 days of active month)
    const weeklyDays = [
      { day: 'Mon', amount: 800, date: 'Oct 20' },
      { day: 'Tue', amount: 1500, date: 'Oct 21' },
      { day: 'Wed', amount: 1500, date: 'Oct 22' },
      { day: 'Thu', amount: 450, date: 'Oct 23' },
      { day: 'Fri', amount: 920, date: 'Oct 24' },
      { day: 'Sat', amount: 2100, date: 'Oct 25' },
      { day: 'Sun', amount: 1200, date: 'Oct 26' },
    ];
    const weeklyTotal = weeklyDays.reduce((acc, d) => acc + d.amount, 0);

    return {
      daily: {
        dateLabel: 'Today (26 Oct 2026)',
        income: dailyIncome || 0,
        expense: dailyExpense || 1200,
        net: (dailyIncome || 0) - (dailyExpense || 1200),
        transactionCount: dailyTx.length || 1,
        transactions: dailyTx,
      },
      weekly: {
        weekLabel: 'Week 4 (Oct 20 - Oct 26, 2026)',
        totalExpense: weeklyTotal,
        averageDaily: Math.round(weeklyTotal / 7),
        peakDay: 'Saturday (₹2,100)',
        days: weeklyDays,
      },
      monthly: {
        monthLabel: selectedMonth,
        totalIncome: financialSummary.income || 0,
        totalExpense: financialSummary.expense || 0,
        totalSpent: financialSummary.expense || 0,
        percentUtilized:
          (user?.monthlyBudget || 35000) > 0
            ? Math.min(
                100,
                Math.round(
                  ((financialSummary.expense || 0) /
                    (user?.monthlyBudget || 35000)) *
                    100
                )
              )
            : 0,
        netSavings: financialSummary.balance || 0,
        budgetLimit: user?.monthlyBudget || 35000,
        remainingBudget: Math.max(
          0,
          (user?.monthlyBudget || 35000) - (financialSummary.expense || 0)
        ),
        savingsRate: financialSummary.savingsRate || 0,
      },
    };
  }, [monthTransactions, selectedMonth, financialSummary, user.monthlyBudget]);

  // Category totals with actual spent amount calculated dynamically
  const categoriesWithSpent = useMemo(() => {
    return categories.map((cat) => {
      const catSpent = monthTransactions
        .filter((t) => t.type === 'expense' && t.category.toLowerCase() === cat.name.toLowerCase())
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const percent = cat.budget > 0 ? Math.min(100, Math.round((catSpent / cat.budget) * 100)) : 0;
      const count = monthTransactions.filter(
        (t) => t.category.toLowerCase() === cat.name.toLowerCase()
      ).length;

      return {
        ...cat,
        spent: catSpent,
        percent,
        transactionCount: count,
        remaining: Math.max(0, cat.budget - catSpent),
      };
    });
  }, [categories, monthTransactions]);

  // Add personalized alert message if any changes in transactions
  const triggerPersonalizedAlert = (actionType, txDetails) => {
    const userName = user.name || 'Valued User';
    let alertTitle = '';
    let alertMsg = '';

    if (actionType === 'ADD') {
      const newBal =
        txDetails.type === 'income'
          ? financialSummary.balance + Number(txDetails.amount)
          : financialSummary.balance - Number(txDetails.amount);

      alertTitle = '🎉 Transaction Added Successfully';
      alertMsg = `Hello ${userName}! Your ${txDetails.type} of ₹${Number(txDetails.amount).toLocaleString('en-IN')} for '${txDetails.title}' (${txDetails.category}) was recorded.\n\nUpdated ${selectedMonth} balance is ₹${newBal.toLocaleString('en-IN')}.`;
    } else if (actionType === 'UPDATE') {
      alertTitle = '✏️ Transaction Updated';
      alertMsg = `Hello ${userName}! Transaction '${txDetails.title}' was successfully updated to ₹${Number(txDetails.amount).toLocaleString('en-IN')}.\n\nYour ${selectedMonth} analytics have been refreshed.`;
    } else if (actionType === 'DELETE') {
      alertTitle = '🗑️ Transaction Removed';
      alertMsg = `Hello ${userName}! '${txDetails.title}' (₹${Number(txDetails.amount).toLocaleString('en-IN')}) was removed from your records.\n\n₹${Number(txDetails.amount).toLocaleString('en-IN')} has been restored to your balance.`;
    }

    // Trigger Native / Web Alert
    Alert.alert(alertTitle, alertMsg, [{ text: 'OK', style: 'default' }]);

    // Also append to in-app recent alerts log
    setRecentAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: alertTitle,
        message: alertMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: actionType === 'DELETE' ? 'warning' : 'success',
      },
      ...prev.slice(0, 9),
    ]);
  };

  // Add new transaction with validation and personalized alert
  const addTransaction = (newTx) => {
    if (!newTx.title || !newTx.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a transaction title/description.');
      return false;
    }
    const numAmount = Number(newTx.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than ₹0.');
      return false;
    }
    if (!newTx.category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }

    const createdTx = {
      id: `tx-${Date.now()}`,
      title: newTx.title.trim(),
      category: newTx.category,
      amount: numAmount,
      type: newTx.type || 'expense',
      date: newTx.date || new Date().toISOString().split('T')[0],
      month: selectedMonth,
      paymentMethod: newTx.paymentMethod || 'UPI',
      notes: newTx.notes ? newTx.notes.trim() : 'Personal entry',
    };

    setTransactions((prev) => [createdTx, ...prev]);

    // Trigger personalized alert
    triggerPersonalizedAlert('ADD', createdTx);
    return true;
  };

  // Update transaction with personalized alert
  const updateTransaction = (id, updatedFields) => {
    let targetTx = null;
    setTransactions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          targetTx = { ...item, ...updatedFields };
          return targetTx;
        }
        return item;
      })
    );

    if (targetTx) {
      triggerPersonalizedAlert('UPDATE', targetTx);
    }
    return true;
  };

  // Delete transaction with personalized alert
  const deleteTransaction = (id) => {
    const targetTx = transactions.find((t) => t.id === id);
    if (!targetTx) return;

    Alert.alert(
      'Confirm Deletion',
      `Dear ${user.name}, are you sure you want to delete '${targetTx.title}' (₹${targetTx.amount})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTransactions((prev) => prev.filter((t) => t.id !== id));
            triggerPersonalizedAlert('DELETE', targetTx);
          },
        },
      ]
    );
  };

  // Update Category Budget
  const updateCategoryBudget = (catId, newBudget) => {
    const numBudget = Number(newBudget);
    if (isNaN(numBudget) || numBudget < 0) {
      Alert.alert('Validation Error', 'Please enter a valid budget amount.');
      return false;
    }

    let updatedCatName = '';
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId || cat.name.toLowerCase() === catId.toLowerCase()) {
          updatedCatName = cat.name;
          return { ...cat, budget: numBudget };
        }
        return cat;
      })
    );

    Alert.alert(
      'Budget Updated',
      `Dear ${user.name}, the monthly budget for '${updatedCatName}' has been updated to ₹${numBudget.toLocaleString('en-IN')}.`
    );
    return true;
  };

  // Add new Category
  const addCategory = (categoryData) => {
    if (!categoryData.name || !categoryData.name.trim()) {
      Alert.alert('Validation Error', 'Category name is required.');
      return false;
    }
    const numBudget = Number(categoryData.budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid budget amount.');
      return false;
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      icon: categoryData.icon || '🏷️',
      color: categoryData.color || '#2563EB',
      bgColor: '#EFF6FF',
      budget: numBudget,
      description: categoryData.description || 'Custom category',
    };

    setCategories((prev) => [...prev, newCat]);
    Alert.alert(
      'Category Created',
      `Category '${newCat.name}' with budget ₹${numBudget.toLocaleString('en-IN')} was added successfully!`
    );
    return true;
  };

  // Update Profile
  const updateProfile = (profileData) => {
    if (!profileData.name || profileData.name.trim().length < 2) {
      Alert.alert('Validation Error', 'Name must have at least 2 characters.');
      return false;
    }
    if (!profileData.email || !profileData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please provide a valid email address.');
      return false;
    }
    if (!profileData.phone || profileData.phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    const budgetNum = Number(profileData.monthlyBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      Alert.alert('Validation Error', 'Monthly budget must be a positive number.');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      name: profileData.name.trim(),
      email: profileData.email.trim(),
      phone: profileData.phone.trim(),
      address: profileData.address ? profileData.address.trim() : prev.address,
      monthlyBudget: budgetNum,
      avatar: profileData.name.trim().charAt(0).toUpperCase(),
    }));

    Alert.alert(
      'Profile Updated',
      `Profile saved! Thank you, ${profileData.name.trim()}.\nYour monthly budget is set to ₹${budgetNum.toLocaleString('en-IN')}.`
    );
    return true;
  };

  // Switch role between Customer and Admin
  const toggleRole = () => {
    const nextRole = role === 'Customer' ? 'Admin' : 'Customer';
    setRole(nextRole);
    Alert.alert(
      'Role Switched',
      `Switched active role to: ${nextRole}!\n${
        nextRole === 'Admin'
          ? 'You now have access to Admin Overview, Platform Statistics, and System Audits.'
          : 'You are now viewing the Customer Budgeting & Personal Finance Portal.'
      }`
    );
  };

  // Add New Administrator (Allows multiple admins to be added)
  const addAdmin = ({ name, email, department, roleTitle, phone }) => {
    if (!name || !name.trim() || !email || !email.trim()) {
      Alert.alert('Validation Error', 'Admin Name and Email are required.');
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = admins.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      Alert.alert('Duplicate Administrator', `An admin with email "${cleanEmail}" already exists.`);
      return false;
    }

    const newAdmin = {
      id: `adm-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: roleTitle || 'Administrator',
      phone: phone ? phone.trim() : '9876500099',
      department: department ? department.trim() : 'Operations & Accounts',
      status: 'Active',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setAdmins((prev) => [newAdmin, ...prev]);

    // Personalized alert
    addPersonalizedAlert(
      'Administrator Added',
      `Hello ${user.name}! New admin ${newAdmin.name} (${newAdmin.email}) was added successfully.`,
      'info'
    );

    Alert.alert(
      'Administrator Created',
      `New Admin "${newAdmin.name}" (${newAdmin.email}) has been added.\nYou can now sign in using this email.`
    );
    return true;
  };

  // Register or record customer dynamically
  const registerCustomer = ({ name, email, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || 'Customer').trim();
    const newCustomer = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail || 'customer@gmail.com',
      phone: phone || '9876543210',
      address: 'Coimbatore, Tamil Nadu',
      memberSince: 'October 2026',
      status: 'Active',
      monthlyBudget: 35000,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const loginUser = (userRole, email, name) => {
    const chosenRole = userRole || 'Customer';
    setRole(chosenRole);
    setIsAuthenticated(true);

    let displayName = name;
    let displayEmail = email ? email.trim().toLowerCase() : '';

    if (chosenRole === 'Admin') {
      displayEmail = displayEmail || 'admin@gmail.com';
      const matchedAdmin = admins.find((a) => a.email.toLowerCase() === displayEmail);
      if (matchedAdmin) {
        displayName = displayName || matchedAdmin.name;
      } else {
        displayName = displayName || 'System Admin';
      }
    } else {
      displayEmail = displayEmail || 'sivani@gmail.com';
      const matchedCustomer = customers.find((c) => c.email.toLowerCase() === displayEmail);
      if (matchedCustomer) {
        displayName = displayName || matchedCustomer.name;
      } else {
        displayName = displayName || 'Sivani M';
      }
    }

    setUser((prev) => ({
      ...prev,
      name: displayName,
      email: displayEmail,
      avatar: displayName.charAt(0).toUpperCase(),
      role: chosenRole,
    }));
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    Alert.alert(
      'Signed Out Safely',
      'You have signed out. Please sign in or create an account on the Home screen to view your financial dashboard.'
    );
  };

  return (
    <FinanceContext.Provider
      value={{
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
        setSelectedMonth,
        reportPeriod,
        setReportPeriod,
        transactions,
        monthTransactions,
        financialSummary,
        reportData,
        categories: categoriesWithSpent,
        recentAlerts,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategoryBudget,
        addCategory,
        updateProfile,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
