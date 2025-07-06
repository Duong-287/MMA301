import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
)

export default function AdminCourtManagement() {
  const [refreshing, setRefreshing] = useState(false)

  const courts = [
    {
      id: 1,
      name: "Sân A1",
      type: "Sân đơn",
      status: "occupied",
      currentBooking: {
        customer: "Nguyễn Văn An",
        timeSlot: "19:00 - 20:30",
        remaining: "45 phút",
      },
      nextBooking: {
        customer: "Trần Thị Bình",
        timeSlot: "20:30 - 22:00",
      },
      price: 80000,
      facilities: ["Điều hòa", "Ánh sáng LED", "Sàn gỗ"],
    },
    {
      id: 2,
      name: "Sân A2",
      type: "Sân đôi",
      status: "available",
      currentBooking: null,
      nextBooking: {
        customer: "Lê Văn Cường",
        timeSlot: "21:00 - 22:30",
      },
      price: 100000,
      facilities: ["Điều hòa", "Âm thanh", "Sàn cao su"],
    },
    {
      id: 3,
      name: "Sân B1",
      type: "Sân đơn",
      status: "maintenance",
      currentBooking: null,
      nextBooking: null,
      price: 80000,
      facilities: ["Quạt trần", "Ánh sáng LED"],
      maintenanceNote: "Sửa chữa lưới",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#10B981"
      case "occupied":
        return "#EF4444"
      case "maintenance":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Trống"
      case "occupied":
        return "Đang sử dụng"
      case "maintenance":
        return "Bảo trì"
      default:
        return status
    }
  }

  const handleCourtAction = (courtId, action) => {
    Alert.alert("Thông báo", `Tính năng ${action} đang được phát triển!`)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý sân</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {courts.map((court) => (
          <View key={court.id} style={styles.courtCard}>
            <View style={styles.courtHeader}>
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{court.name}</Text>
                <Text style={styles.courtType}>{court.type}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(court.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(court.status) }]}>
                  {getStatusText(court.status)}
                </Text>
              </View>
            </View>

            <View style={styles.courtDetails}>
              <View style={styles.detailRow}>
                <Icon name="money" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{court.price.toLocaleString("vi-VN")}đ/1.5h</Text>
              </View>

              <View style={styles.facilitiesContainer}>
                <Icon name="star" size={16} color="#6B7280" />
                <View style={styles.facilities}>
                  {court.facilities.map((facility, index) => (
                    <View key={index} style={styles.facilityTag}>
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {court.status === "occupied" && court.currentBooking && (
              <View style={styles.currentBooking}>
                <Text style={styles.currentBookingTitle}>Đang sử dụng:</Text>
                <Text style={styles.currentBookingInfo}>
                  {court.currentBooking.customer} • {court.currentBooking.timeSlot}
                </Text>
                <Text style={styles.remainingTime}>Còn lại: {court.currentBooking.remaining}</Text>
              </View>
            )}

            {court.nextBooking && (
              <View style={styles.nextBooking}>
                <Text style={styles.nextBookingTitle}>Lịch tiếp theo:</Text>
                <Text style={styles.nextBookingInfo}>
                  {court.nextBooking.customer} • {court.nextBooking.timeSlot}
                </Text>
              </View>
            )}

            {court.status === "maintenance" && court.maintenanceNote && (
              <View style={styles.maintenanceInfo}>
                <Icon name="warning" size={16} color="#F59E0B" />
                <Text style={styles.maintenanceText}>{court.maintenanceNote}</Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleCourtAction(court.id, "schedule")}>
                <Icon name="calendar" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Lịch</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleCourtAction(court.id, "edit")}>
                <Icon name="edit" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleCourtAction(court.id, "settings")}>
                <Icon name="settings" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Cài đặt</Text>
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  courtCard: {
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
  courtHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courtInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  courtType: {
    fontSize: 14,
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
  courtDetails: {
    marginBottom: 12,
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
  facilitiesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  facilities: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 8,
    flex: 1,
  },
  facilityTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  facilityText: {
    fontSize: 12,
    color: "#6B7280",
  },
  currentBooking: {
    backgroundColor: "#FEF3F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  currentBookingTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 4,
  },
  currentBookingInfo: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  remainingTime: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  nextBooking: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  nextBookingTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    marginBottom: 4,
  },
  nextBookingInfo: {
    fontSize: 14,
    color: "#374151",
  },
  maintenanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  maintenanceText: {
    fontSize: 14,
    color: "#92400E",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
})
