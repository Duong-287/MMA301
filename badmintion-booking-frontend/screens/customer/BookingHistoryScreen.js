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
} from "react-native";
import { getHistoryBooking } from "../../services/booking";

const BookingHistoryScreen = ({ navigation, route }) => {
  const { customerId } = route?.params || { customerId: "customer123" };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    loadBookingHistory();
  }, [customerId, selectedFilter]);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);

      const result = await getHistoryBooking();

      if (!result.success) {
        Alert.alert("Lỗi", result.message || "Không thể tải lịch sử đặt sân.");
        return;
      }

      let apiBookings = result.data?.bookings || [];

      console.log("Bookings nhận về:", apiBookings);
      // Nếu muốn lọc theo trạng thái (confirmed, pending, completed,...)
      if (selectedFilter !== "all") {
        apiBookings = apiBookings.filter(
          (booking) => booking.status === selectedFilter
        );
      }
      console.log(apiBookings);
      setBookings(apiBookings);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể tải lịch sử đặt sân.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookingHistory();
    setRefreshing(false);
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert("Hủy đặt sân", "Bạn có chắc chắn muốn hủy đặt sân này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy đặt sân",
        style: "destructive",
        onPress: async () => {
          try {
            // await bookingAPI.cancelBooking(bookingId, "Khách hàng hủy")
            Alert.alert("Thành công", "Đã hủy đặt sân thành công");
            loadBookingHistory();
          } catch (error) {
            Alert.alert("Lỗi", error.message);
          }
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FF9800";
      case "confirmed":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || "0";
  };

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    return (
      (booking.status === "pending" || booking.status === "confirmed") &&
      hoursDiff > 2
    );
  };

  const renderBookingCard = (booking) => (
    <View key={booking._id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.courtName}>{booking.courtName}</Text>
          <Text style={styles.bookingDate}>{formatDate(booking.date)}</Text>
          <Text style={styles.bookingTime}>
            {booking.startTime} - {booking.endTime}
          </Text>
        </View>
        <View style={styles.bookingStatus}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(booking.status)}
            </Text>
          </View>
          <Text style={styles.bookingAmount}>
            {formatCurrency(booking.totalAmount)} VNĐ
          </Text>
        </View>
      </View>

      <View style={styles.bookingActions}>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Chi tiết</Text>
        </TouchableOpacity>

        {canCancelBooking(booking) && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(booking._id)}
          >
            <Text style={styles.cancelButtonText}>Hủy đặt</Text>
          </TouchableOpacity>
        )}

        {booking.status === "completed" && (
          <TouchableOpacity style={styles.rebookButton}>
            <Text style={styles.rebookButtonText}>Đặt lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Đang tải lịch sử đặt sân...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đặt sân</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ duyệt" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "completed", label: "Hoàn thành" },
            { key: "cancelled", label: "Đã hủy" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.length > 0 ? (
          bookings.map(renderBookingCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Chưa có lịch sử đặt sân</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === "all"
                ? "Bạn chưa đặt sân nào. Hãy đặt sân đầu tiên!"
                : `Không có booking nào với trạng thái "${getStatusText(
                    selectedFilter
                  )}"`}
            </Text>
            {selectedFilter === "all" && (
              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() => navigation.navigate("Booking")}
              >
                <Text style={styles.bookNowButtonText}>Đặt sân ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  filterTabActive: {
    backgroundColor: "#2E7D32",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 14,
    color: "#666",
  },
  bookingStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  bookingAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  bookingActions: {
    flexDirection: "row",
    gap: 8,
  },
  detailButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cancelButtonText: {
    fontSize: 12,
    color: "#f44336",
    fontWeight: "500",
  },
  rebookButton: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  rebookButtonText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  bookNowButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bookNowButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingHistoryScreen;
