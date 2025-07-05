import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock icons - trong thực tế bạn sẽ sử dụng react-native-vector-icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
)

const { width } = Dimensions.get("window")

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today") // today, week, month
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview") // overview, bookings, courts, users

  // Mock data - trong thực tế sẽ fetch từ API
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 15750000,
      totalBookings: 127,
      activeUsers: 89,
      courtUtilization: 78,
      todayBookings: 23,
      pendingBookings: 5,
    },
    recentBookings: [
      {
        id: 1,
        customerName: "Nguyễn Văn An",
        court: "Sân A1",
        time: "19:00 - 20:30",
        date: "15/12/2024",
        status: "confirmed",
        amount: 120000,
      },
      {
        id: 2,
        customerName: "Trần Thị Bình",
        court: "Sân B2",
        time: "18:00 - 19:30",
        date: "15/12/2024",
        status: "pending",
        amount: 100000,
      },
      {
        id: 3,
        customerName: "Lê Văn Cường",
        court: "Sân C1",
        time: "20:00 - 21:30",
        date: "15/12/2024",
        status: "completed",
        amount: 150000,
      },
      {
        id: 4,
        customerName: "Phạm Thị Dung",
        court: "Sân A2",
        time: "17:00 - 18:30",
        date: "15/12/2024",
        status: "cancelled",
        amount: 120000,
      },
    ],
    courts: [
      { id: 1, name: "Sân A1", type: "Sân đơn", status: "occupied", nextAvailable: "20:30" },
      { id: 2, name: "Sân A2", type: "Sân đôi", status: "available", nextAvailable: null },
      { id: 3, name: "Sân B1", type: "Sân đơn", status: "maintenance", nextAvailable: "Tomorrow" },
      { id: 4, name: "Sân B2", type: "Sân đôi", status: "occupied", nextAvailable: "19:30" },
      { id: 5, name: "Sân C1", type: "Sân VIP", status: "available", nextAvailable: null },
      { id: 6, name: "Sân C2", type: "Sân VIP", status: "occupied", nextAvailable: "21:00" },
    ],
    topUsers: [
      { id: 1, name: "Nguyễn Văn An", bookings: 15, spent: 1800000 },
      { id: 2, name: "Trần Thị Bình", bookings: 12, spent: 1440000 },
      { id: 3, name: "Lê Văn Cường", bookings: 10, spent: 1500000 },
    ],
  })

  const periods = [
    { id: "today", label: "Hôm nay" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
  ]

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "dashboard" },
    { id: "bookings", label: "Đặt sân", icon: "calendar" },
    { id: "courts", label: "Sân", icon: "court" },
    { id: "users", label: "Người dùng", icon: "users" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10B981"
      case "pending":
        return "#F59E0B"
      case "completed":
        return "#3B82F6"
      case "cancelled":
        return "#EF4444"
      case "occupied":
        return "#EF4444"
      case "available":
        return "#10B981"
      case "maintenance":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      case "occupied":
        return "Đang sử dụng"
      case "available":
        return "Trống"
      case "maintenance":
        return "Bảo trì"
      default:
        return status
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
      Alert.alert("Thành công", "Dữ liệu đã được cập nhật!")
    }, 2000)
  }

  const handleBookingAction = (bookingId, action) => {
    Alert.alert("Xác nhận", `Bạn có muốn ${action === "confirm" ? "xác nhận" : "hủy"} đặt sân này?`, [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: () => {
          Alert.alert("Thành công", `Đã ${action === "confirm" ? "xác nhận" : "hủy"} đặt sân!`)
        },
      },
    ])
  }

  const handleCourtAction = (courtId, action) => {
    Alert.alert("Thông báo", `Tính năng ${action} sân đang được phát triển!`)
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Quản lý sân cầu lông</Text>
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        <Icon name="bell" size={24} color="#111827" />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>5</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.id}
          style={[styles.periodButton, selectedPeriod === period.id && styles.activePeriod]}
          onPress={() => setSelectedPeriod(period.id)}
        >
          <Text style={[styles.periodText, selectedPeriod === period.id && styles.activePeriodText]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.revenueCard]}>
          <View style={styles.statIcon}>
            <Icon name="money" size={24} color="#10B981" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{dashboardData.stats.totalRevenue.toLocaleString("vi-VN")}đ</Text>
            <Text style={styles.statLabel}>Doanh thu</Text>
          </View>
        </View>

        <View style={[styles.statCard, styles.bookingCard]}>
          <View style={styles.statIcon}>
            <Icon name="calendar" size={24} color="#3B82F6" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{dashboardData.stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Lượt đặt</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.userCard]}>
          <View style={styles.statIcon}>
            <Icon name="users" size={24} color="#8B5CF6" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{dashboardData.stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Người dùng</Text>
          </View>
        </View>

        <View style={[styles.statCard, styles.utilizationCard]}>
          <View style={styles.statIcon}>
            <Icon name="chart" size={24} color="#F59E0B" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{dashboardData.stats.courtUtilization}%</Text>
            <Text style={styles.statLabel}>Tỷ lệ sử dụng</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={16} color={activeTab === tab.id ? "#fff" : "#6B7280"} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hoạt động hôm nay</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.todayStats}>
          <View style={styles.todayStatItem}>
            <Text style={styles.todayStatValue}>{dashboardData.stats.todayBookings}</Text>
            <Text style={styles.todayStatLabel}>Đặt sân hôm nay</Text>
          </View>
          <View style={styles.todayStatItem}>
            <Text style={styles.todayStatValue}>{dashboardData.stats.pendingBookings}</Text>
            <Text style={styles.todayStatLabel}>Chờ xác nhận</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khách hàng VIP</Text>
        {dashboardData.topUsers.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userStats}>
                {user.bookings} lượt đặt • {user.spent.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="phone" size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )

  const renderBookings = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đặt sân gần đây</Text>
        {dashboardData.recentBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingItem}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingCustomer}>{booking.customerName}</Text>
              <Text style={styles.bookingDetails}>
                {booking.court} • {booking.date} • {booking.time}
              </Text>
              <Text style={styles.bookingAmount}>{booking.amount.toLocaleString("vi-VN")}đ</Text>
            </View>

            <View style={styles.bookingActions}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {getStatusText(booking.status)}
                </Text>
              </View>

              {booking.status === "pending" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => handleBookingAction(booking.id, "confirm")}
                  >
                    <Icon name="check" size={14} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleBookingAction(booking.id, "cancel")}
                  >
                    <Icon name="x" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderCourts = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trạng thái sân</Text>
        <View style={styles.courtsGrid}>
          {dashboardData.courts.map((court) => (
            <View key={court.id} style={styles.courtCard}>
              <View style={styles.courtHeader}>
                <Text style={styles.courtName}>{court.name}</Text>
                <View style={[styles.courtStatus, { backgroundColor: getStatusColor(court.status) + "20" }]}>
                  <Text style={[styles.courtStatusText, { color: getStatusColor(court.status) }]}>
                    {getStatusText(court.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.courtType}>{court.type}</Text>

              {court.nextAvailable && <Text style={styles.courtNext}>Trống lúc: {court.nextAvailable}</Text>}

              <View style={styles.courtActions}>
                <TouchableOpacity
                  style={styles.courtActionButton}
                  onPress={() => handleCourtAction(court.id, "schedule")}
                >
                  <Icon name="calendar" size={14} color="#6B7280" />
                  <Text style={styles.courtActionText}>Lịch</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.courtActionButton}
                  onPress={() => handleCourtAction(court.id, "settings")}
                >
                  <Icon name="settings" size={14} color="#6B7280" />
                  <Text style={styles.courtActionText}>Cài đặt</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản lý người dùng</Text>

        <View style={styles.userActions}>
          <TouchableOpacity style={styles.userActionButton}>
            <Icon name="plus" size={16} color="#10B981" />
            <Text style={styles.userActionText}>Thêm người dùng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.userActionButton}>
            <Icon name="download" size={16} color="#3B82F6" />
            <Text style={styles.userActionText}>Xuất danh sách</Text>
          </TouchableOpacity>
        </View>

        {dashboardData.topUsers.map((user) => (
          <View key={user.id} style={styles.userManageItem}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userStats}>
                {user.bookings} lượt đặt • {user.spent.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View style={styles.userManageActions}>
              <TouchableOpacity style={styles.userManageButton}>
                <Icon name="edit" size={14} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.userManageButton}>
                <Icon name="trash" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "bookings":
        return renderBookings()
      case "courts":
        return renderCourts()
      case "users":
        return renderUsers()
      default:
        return renderOverview()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {renderPeriodSelector()}
        {renderStatsCards()}
        {renderTabs()}
        {renderTabContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  iconPlaceholder: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  periodContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  activePeriod: {
    backgroundColor: "#10B981",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activePeriodText: {
    color: "#fff",
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  todayStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  todayStatItem: {
    alignItems: "center",
  },
  todayStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 4,
  },
  todayStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: "#6B7280",
  },
  contactButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F0FDF4",
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingCustomer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  bookingDetails: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  bookingAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  bookingActions: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  confirmButton: {
    backgroundColor: "#10B981",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  courtsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  courtCard: {
    width: (width - 64) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  courtHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  courtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  courtStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  courtStatusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  courtType: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  courtNext: {
    fontSize: 12,
    color: "#10B981",
    marginBottom: 8,
  },
  courtActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  courtActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  courtActionText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  userActions: {
    flexDirection: "row",
    marginBottom: 16,
  },
  userActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  userActionText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  userManageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  userManageActions: {
    flexDirection: "row",
  },
  userManageButton: {
    padding: 8,
    marginLeft: 4,
  },
  bottomPadding: {
    height: 32,
  },
})
