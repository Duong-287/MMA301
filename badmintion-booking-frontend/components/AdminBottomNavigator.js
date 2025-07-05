"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AdminDashboard from "../screens/admin/AdminDashboardScreen"
import AdminBookingManagement from "../screens/admin/AdminBookingManagement"
import AdminCourtManagement from "../screens/admin/AdminCourtManagement"
import AdminWalletScreen from "../screens/admin/AdminWalletScreen"
import AdminUserManagement from "../screens/admin/AdminUserManagement"

// Import các screen components


// Mock icons - trong thực tế bạn sẽ sử dụng react-native-vector-icons
const Icon = ({ name, size = 20, color = "#666", focused = false }) => {
  const iconMap = {
    dashboard: "📊",
    bookings: "📅",
    courts: "🏸",
    wallet: "💰",
    users: "👥",
  }

  return (
    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>{iconMap[name] || "📱"}</Text>
    </View>
  )
}

const { width } = Dimensions.get("window")

export default function c() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [animatedValue] = useState(new Animated.Value(0))

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      component: AdminDashboard,
      badge: null,
    },
    {
      id: "bookings",
      label: "Đặt sân",
      icon: "bookings",
      component: AdminBookingManagement,
      badge: 5, // Số booking chờ xử lý
    },
    {
      id: "courts",
      label: "Sân",
      icon: "courts",
      component: AdminCourtManagement,
      badge: null,
    },
    {
      id: "wallet",
      label: "Ví",
      icon: "wallet",
      component: AdminWalletScreen,
      badge: null,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: "users",
      component: AdminUserManagement,
      badge: 2, // Số user mới đăng ký
    },
  ]

  const handleTabPress = (tabId, index) => {
    setActiveTab(tabId)

    // Animation cho tab indicator
    Animated.spring(animatedValue, {
      toValue: index,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  const renderTabContent = () => {
    const activeTabData = tabs.find((tab) => tab.id === activeTab)
    if (!activeTabData) return null

    const Component = activeTabData.component
    return <Component />
  }

  const renderTabBar = () => {
    const indicatorWidth = width / tabs.length
    const translateX = animatedValue.interpolate({
      inputRange: tabs.map((_, index) => index),
      outputRange: tabs.map((_, index) => index * indicatorWidth),
    })

    return (
      <View style={styles.tabBar}>
        {/* Animated Indicator */}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: indicatorWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tab Buttons */}
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.id, index)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={styles.iconWrapper}>
                  <Icon name={tab.icon} size={24} color={isActive ? "#10B981" : "#6B7280"} focused={isActive} />

                  {/* Badge */}
                  {tab.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{tab.badge > 99 ? "99+" : tab.badge}</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? "#10B981" : "#6B7280",
                      fontWeight: isActive ? "600" : "400",
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Main Content */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* Bottom Tab Bar */}
      {renderTabBar()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 8,
    paddingTop: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIndicator: {
    position: "absolute",
    top: 0,
    height: 3,
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  focusedIconContainer: {
    backgroundColor: "#F0FDF4",
  },
  iconText: {
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
  },
})
