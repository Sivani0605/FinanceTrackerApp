import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useFinance } from '@/context/FinanceContext';

function TabIcon({ icon, focused, label }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.iconText, focused && styles.focusedIcon]}>{icon}</Text>
      <Text style={[styles.labelText, focused && styles.focusedLabel]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { role } = useFinance();
  const isAdmin = role === 'Admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 1. Home Screen (Admin and Customers) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} label="Home" />
          ),
        }}
      />

      {/* 2. Analysis Screen (Admin and Customers) */}
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" focused={focused} label="Analysis" />
          ),
        }}
      />

      {/* 3. Transaction (month wise) Screen (only Customer) */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          href: isAdmin ? null : '/transactions',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💳" focused={focused} label="Transactions" />
          ),
        }}
      />

      {/* 4. Overall Categories Screen (only Customer) */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          href: isAdmin ? null : '/categories',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏷️" focused={focused} label="Categories" />
          ),
        }}
      />

      {/* 5. Profile and Edit Profile Screen (only Customer) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: isAdmin ? null : '/profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  iconText: {
    fontSize: 20,
    opacity: 0.6,
  },
  focusedIcon: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  focusedLabel: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
