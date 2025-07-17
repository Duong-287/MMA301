import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import BottomNavigation from "./BottomNavigation";
import { addMoneyToWallet, getCustomerWallet } from "../services/wallet";

const AccountLoggedIn = ({
  userName,
  userInitial,
  onNotificationPress,
  onCalendarPress,
  onProfilePress,
  onPasswordPress,
  onMembershipPress,
  onBookingHistoryPress,
  onAppInfoPress,
  onWhatsNewPress,
  onLanguagePress,
  onSettingsPress,
  onLogoutPress,
  onWalletPress,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerBackground}>
          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              {/* Header Actions */}
              <View style={styles.topActions}>
                <TouchableOpacity onPress={onNotificationPress}>
                  <View
                    style={[styles.actionIcon, { backgroundColor: "#4CAF50" }]}
                  >
                    <Text style={styles.actionIconText}>🔔</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCalendarPress}>
                  <View
                    style={[styles.actionIcon, { backgroundColor: "#FFC107" }]}
                  >
                    <Text style={styles.actionIconText}>📅</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Avatar + Username */}
              <View style={styles.avatarContainer}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>{userInitial}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{userName}</Text>

              {/* Các nút hành động nhanh */}
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={onProfilePress}
                >
                  <View style={styles.quickActionIcon}>
                    <Text style={styles.quickActionEmoji}>👤</Text>
                  </View>
                  <Text style={styles.quickActionText}>Thông tin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={onPasswordPress}
                >
                  <View style={styles.quickActionIcon}>
                    <Text style={styles.quickActionEmoji}>🔒</Text>
                  </View>
                  <Text style={styles.quickActionText}>Mật khẩu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={onWalletPress}
                >
                  <View style={styles.quickActionIcon}>
                    <Text style={styles.quickActionEmoji}>💰</Text>
                  </View>
                  <Text style={styles.quickActionText}>Ví</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={onMembershipPress}
                >
                  <View style={styles.quickActionIcon}>
                    <Text style={styles.quickActionEmoji}>⭐</Text>
                  </View>
                  <Text style={styles.quickActionText}>Thành viên</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContent}>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Hoạt động</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onBookingHistoryPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>📅</Text>
                </View>
                <Text style={styles.menuItemText}>Danh sách lịch đã đặt</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Hệ thống</Text>

            <TouchableOpacity style={styles.menuItem} onPress={onAppInfoPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>ℹ️</Text>
                </View>
                <Text style={styles.menuItemText}>
                  Thông tin phiên bản: 2.6.17
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onWhatsNewPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.menuItemText}>Ứng dụng có gì mới</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onLanguagePress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>🌐</Text>
                </View>
                <Text style={styles.menuItemText}>Ngôn ngữ - Tiếng Việt</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onSettingsPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>⚙️</Text>
                </View>
                <Text style={styles.menuItemText}>Cài đặt</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onLogoutPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>🚪</Text>
                </View>
                <Text style={styles.menuItemText}>Đăng xuất tài khoản</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
  },
  headerBackground: {
    height: 450,
    backgroundColor: "#E3F2FD",
    position: "relative",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  colorBlock: {
    position: "absolute",
    opacity: 0.7,
    borderRadius: 8,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionIconText: {
    fontSize: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  userInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 30,
    textAlign: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "100%",
    justifyContent: "space-around",
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 18,
  },
  newBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default AccountLoggedIn;
