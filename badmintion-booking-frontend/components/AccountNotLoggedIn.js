import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";

const AccountNotLoggedIn = ({
  onLoginPress,
  onRegisterPress,
  onBookingHistoryPress,
  onAppInfoPress,
  onWhatsNewPress,
  onLanguagePress,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with sports background */}
        <View style={styles.headerBackground}>
          {/* Background pattern simulation */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.sportItem, { top: 20, left: 30 }]}>
              <Text style={styles.sportEmoji}>🎾</Text>
            </View>
            <View style={[styles.sportItem, { top: 60, right: 40 }]}>
              <Text style={styles.sportEmoji}>🏸</Text>
            </View>
            <View style={[styles.sportItem, { top: 100, left: 60 }]}>
              <Text style={styles.sportEmoji}>⚽</Text>
            </View>
            <View style={[styles.sportItem, { top: 40, right: 80 }]}>
              <Text style={styles.sportEmoji}>🏓</Text>
            </View>
          </View>

          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <Text style={styles.appTitle}>
                ALOBO - Đặt lịch online sân thể thao
              </Text>
              <Text style={styles.subtitle}>
                Tạo tài khoản để nhận nhiều ưu đãi hơn
              </Text>

              {/* Default Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.defaultAvatar}>
                  <View style={styles.avatarIcon}>
                    <View style={styles.avatarHead} />
                    <View style={styles.avatarBody} />
                  </View>
                </View>
              </View>

              {/* Auth Buttons */}
              <View style={styles.authButtonsContainer}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={onLoginPress}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={onRegisterPress}
                >
                  <Text style={styles.registerButtonText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Content */}
        <View style={styles.menuContent}>
          {/* Activities Section */}
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

          {/* System Section */}
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
          </View>
        </View>
      </ScrollView>
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
    height: 400,
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sportItem: {
    position: "absolute",
    opacity: 0.3,
  },
  sportEmoji: {
    fontSize: 30,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6B7280",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    alignItems: "center",
  },
  avatarHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 4,
  },
  avatarBody: {
    width: 32,
    height: 20,
    borderRadius: 16,
    backgroundColor: "white",
  },
  authButtonsContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    maxWidth: 300,
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
});

export default AccountNotLoggedIn;
