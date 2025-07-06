import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { courtAPI } from "../../services/court";
import { bookingAPI } from "../../services/booking";
import { walletAPI } from "../../services/wallet";

const { width } = Dimensions.get("window");

const OwnerDashboardScreen = ({ navigation, route }) => {
  const { ownerId } = route?.params || { ownerId: "owner123" }; // Default for testing

  const [dashboardData, setDashboardData] = useState({
    courts: [],
    todayBookings: [],
    revenueStats: {},
    walletInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [ownerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [courtsResponse, walletResponse, revenueResponse] =
        await Promise.all([
          courtAPI.getCourtsByOwner(ownerId),
          walletAPI.getWalletInfo(ownerId),
          walletAPI.getRevenueStats(ownerId, new Date(), new Date()),
        ]);

      // Load today's bookings for active courts
      let todayBookings = [];
      if (courtsResponse.success && courtsResponse.data.length > 0) {
        const activeCourts = courtsResponse.data.filter(
          (court) => court.status === "active"
        );
        if (activeCourts.length > 0) {
          const bookingsResponse = await bookingAPI.getBookingsByOwner(
            ownerId,
            {
              date: new Date().toISOString().split("T")[0],
              status: "confirmed",
            }
          );
          if (bookingsResponse.success) {
            todayBookings = bookingsResponse.data;
          }
        }
      }

      setDashboardData({
        courts: courtsResponse.success ? courtsResponse.data : [],
        todayBookings,
        revenueStats: revenueResponse.success ? revenueResponse.data : {},
        walletInfo: walletResponse.success ? walletResponse.data : {},
      });
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || "0";
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayRevenue = dashboardData.revenueStats.dailyRevenue?.[today] || 0;
    const totalBookings = dashboardData.todayBookings.length;
    const completedBookings = dashboardData.todayBookings.filter(
      (b) => b.status === "completed"
    ).length;

    return {
      revenue: todayRevenue,
      totalBookings,
      completedBookings,
    };
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return dashboardData.todayBookings
      .filter((booking) => booking.startTime > currentTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 3);
  };

  // Navigation handlers
  const navigateToManageCourts = () => {
    navigation.navigate("ManageCourts", { ownerId });
  };

  const navigateToCourtSchedule = () => {
    navigation.navigate("CourtSchedule", { ownerId });
  };

  const navigateToOwnerWallet = () => {
    navigation.navigate("OwnerWallet", { ownerId });
  };

  const navigateToEditCourt = (isNewCourt = true, courtId = null) => {
    navigation.navigate("EditCourt", {
      ownerId,
      isNewCourt,
      courtId,
    });
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: () => {
          // Clear user data and navigate to login
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Đang tải dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const todayStats = getTodayStats();
  const upcomingBookings = getUpcomingBookings();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.ownerName}>Chủ sân</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={navigateToManageCourts}
          >
            <Text style={styles.statNumber}>{dashboardData.courts.length}</Text>
            <Text style={styles.statLabel}>Tổng sân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={navigateToManageCourts}
          >
            <Text style={styles.statNumber}>
              {dashboardData.courts.filter((c) => c.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>Hoạt động</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={navigateToCourtSchedule}
          >
            <Text style={styles.statNumber}>{todayStats.totalBookings}</Text>
            <Text style={styles.statLabel}>Booking hôm nay</Text>
          </TouchableOpacity>
        </View>

        {/* Today Revenue */}
        <TouchableOpacity
          style={styles.revenueCard}
          onPress={navigateToOwnerWallet}
        >
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueTitle}>Doanh thu hôm nay</Text>
            <Text style={styles.viewAllText}>Xem chi tiết →</Text>
          </View>
          <Text style={styles.revenueAmount}>
            {formatCurrency(todayStats.revenue)} VNĐ
          </Text>
          <View style={styles.revenueStats}>
            <View style={styles.revenueStatItem}>
              <Text style={styles.revenueStatNumber}>
                {todayStats.completedBookings}
              </Text>
              <Text style={styles.revenueStatLabel}>Hoàn thành</Text>
            </View>
            <View style={styles.revenueStatItem}>
              <Text style={styles.revenueStatNumber}>
                {formatCurrency(dashboardData.walletInfo.balance)} VNĐ
              </Text>
              <Text style={styles.revenueStatLabel}>Số dư ví</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={navigateToManageCourts}
            >
              <Text style={styles.actionIcon}>🏸</Text>
              <Text style={styles.actionText}>Quản lý sân</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={navigateToCourtSchedule}
            >
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Lịch trình</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={navigateToOwnerWallet}
            >
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Ví tiền</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigateToEditCourt(true)}
            >
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionText}>Thêm sân</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Booking sắp tới</Text>
            <TouchableOpacity onPress={navigateToCourtSchedule}>
              <Text style={styles.viewAllText}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>

          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookingCard}
                onPress={navigateToCourtSchedule}
              >
                <View style={styles.bookingTime}>
                  <Text style={styles.bookingTimeText}>
                    {booking.startTime}
                  </Text>
                  <Text style={styles.bookingDuration}>1 giờ</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingCourtName}>
                    {booking.courtName}
                  </Text>
                  <Text style={styles.bookingCustomer}>
                    👤 {booking.customerName}
                  </Text>
                  <Text style={styles.bookingPhone}>
                    📞 {booking.customerPhone}
                  </Text>
                </View>
                <View style={styles.bookingAmount}>
                  <Text style={styles.bookingAmountText}>
                    {formatCurrency(booking.totalAmount)} VNĐ
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              style={styles.emptyBookings}
              onPress={navigateToCourtSchedule}
            >
              <Text style={styles.emptyBookingsIcon}>📅</Text>
              <Text style={styles.emptyBookingsText}>
                Không có booking nào sắp tới
              </Text>
              <Text style={styles.emptyBookingsSubtext}>
                Nhấn để xem lịch trình
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <View style={styles.activityList}>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={navigateToCourtSchedule}
            >
              <Text style={styles.activityIcon}>✅</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Booking được xác nhận</Text>
                <Text style={styles.activityTime}>2 phút trước</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={navigateToOwnerWallet}
            >
              <Text style={styles.activityIcon}>💰</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  Nhận thanh toán {formatCurrency(100000)} VNĐ
                </Text>
                <Text style={styles.activityTime}>15 phút trước</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={navigateToCourtSchedule}
            >
              <Text style={styles.activityIcon}>📝</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Booking mới được tạo</Text>
                <Text style={styles.activityTime}>1 giờ trước</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings & Logout */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={navigateToProfile}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
            <Text style={styles.settingsText}>Cài đặt tài khoản</Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
            <Text style={styles.settingsIcon}>🚪</Text>
            <Text style={[styles.settingsText, { color: "#F44336" }]}>
              Đăng xuất
            </Text>
            <Text style={styles.settingsArrow}>→</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  ownerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  quickStats: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  revenueCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  revenueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
  },
  revenueStats: {
    flexDirection: "row",
    gap: 24,
  },
  revenueStatItem: {
    alignItems: "center",
  },
  revenueStatNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  revenueStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: (width - 48) / 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  upcomingSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingTime: {
    alignItems: "center",
    marginRight: 16,
  },
  bookingTimeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  bookingDuration: {
    fontSize: 12,
    color: "#666",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingCourtName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  bookingCustomer: {
    fontSize: 12,
    color: "#666",
    marginBottom: 1,
  },
  bookingPhone: {
    fontSize: 12,
    color: "#666",
  },
  bookingAmount: {
    alignItems: "flex-end",
  },
  bookingAmountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  emptyBookings: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyBookingsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyBookingsText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  emptyBookingsSubtext: {
    fontSize: 12,
    color: "#999",
  },
  activitySection: {
    marginTop: 24,
  },
  activityList: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
  },
  settingsSection: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  settingsArrow: {
    fontSize: 16,
    color: "#666",
  },
});

export default OwnerDashboardScreen;