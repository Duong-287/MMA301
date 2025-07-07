import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
)

export default function AdminBookingManagement() {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filters = [
    { id: "all", label: "Tất cả", count: 25 },
    { id: "pending", label: "Chờ xác nhận", count: 5 },
    { id: "confirmed", label: "Đã xác nhận", count: 15 },
    { id: "completed", label: "Hoàn thành", count: 3 },
    { id: "cancelled", label: "Đã hủy", count: 2 },
  ]

  const bookings = [
    {
      id: 1,
      customerName: "Nguyễn Văn An",
      phone: "0123456789",
      court: "Sân A1",
      date: "15/12/2024",
      time: "19:00 - 20:30",
      duration: 90,
      amount: 120000,
      status: "pending",
      bookingTime: "14:30 hôm nay",
      note: "Cần sân có điều hòa",
    },
    {
      id: 2,
      customerName: "Trần Thị Bình",
      phone: "0987654321",
      court: "Sân B2",
      date: "16/12/2024",
      time: "18:00 - 19:30",
      duration: 90,
      amount: 100000,
      status: "confirmed",
      bookingTime: "10:15 hôm nay",
      note: "",
    },
    {
      id: 3,
      customerName: "Lê Văn Cường",
      phone: "0369852147",
      court: "Sân C1",
      date: "14/12/2024",
      time: "20:00 - 21:30",
      duration: 90,
      amount: 150000,
      status: "completed",
      bookingTime: "Hôm qua",
      note: "Khách VIP",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F59E0B"
      case "confirmed":
        return "#10B981"
      case "completed":
        return "#3B82F6"
      case "cancelled":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận"
      case "confirmed":
        return "Đã xác nhận"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const handleBookingAction = (bookingId, action) => {
    Alert.alert("Xác nhận", `Bạn có muốn ${action === "confirm" ? "xác nhận" : "hủy"} đặt sân này?`, [
      { text: "Không", style: "cancel" },
      { text: "Có", onPress: () => Alert.alert("Thành công", "Đã cập nhật!") },
    ])
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đặt sân</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterButton, selectedFilter === filter.id && styles.activeFilter]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[styles.filterText, selectedFilter === filter.id && styles.activeFilterText]}>
              {filter.label}
            </Text>
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{filter.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{booking.customerName}</Text>
                <Text style={styles.bookingTime}>{booking.bookingTime}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {getStatusText(booking.status)}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Icon name="court" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.court}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="calendar" size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {booking.date} • {booking.time}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="phone" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="money" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.amount.toLocaleString("vi-VN")}đ</Text>
              </View>
              {booking.note && (
                <View style={styles.detailRow}>
                  <Icon name="note" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.note}</Text>
                </View>
              )}
            </View>

            {booking.status === "pending" && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmButton]}
                  onPress={() => handleBookingAction(booking.id, "confirm")}
                >
                  <Text style={styles.confirmButtonText}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => handleBookingAction(booking.id, "cancel")}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  activeFilter: {
    backgroundColor: "#10B981",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 6,
  },
  activeFilterText: {
    color: "#fff",
  },
  filterCount: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    marginLeft: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
