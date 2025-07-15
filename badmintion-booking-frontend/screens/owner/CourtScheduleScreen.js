import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { bookingAPI } from "../../services/booking";

const { width } = Dimensions.get("window");

const CourtScheduleScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState("Sân 1");
  
  // State lưu danh sách sân
  const [courtList, setCourtList] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const dataBooking = await bookingAPI.getBookingsByOwner();
        setCourtList(dataBooking?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sân:", error.message);
      }
    };

    fetchBookings();
  }, []);

  // Lấy mảng tên sân
  const courts = courtList.map(court => court.name) || ["null"];

  // Mock data for time slots
  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  // Mock booking data
  const bookings = {
    "06:00": {
      status: "booked",
      customer: "Nguyễn Văn A",
      phone: "0901234567",
    },
    "07:00": { status: "booked", customer: "Trần Thị B", phone: "0907654321" },
    "09:00": { status: "blocked", reason: "Bảo trì sân" },
    "14:00": { status: "booked", customer: "Lê Văn C", phone: "0912345678" },
    "18:00": { status: "booked", customer: "Phạm Thị D", phone: "0987654321" },
    "19:00": { status: "booked", customer: "Hoàng Văn E", phone: "0934567890" },
  };

  // Generate dates for the week
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getDayName = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  const getSlotStatus = (time) => {
    return bookings[time]?.status || "available";
  };

  const getSlotColor = (status) => {
    switch (status) {
      case "booked":
        return "#FF5722";
      case "blocked":
        return "#9E9E9E";
      default:
        return "#4CAF50";
    }
  };

  const getSlotTextColor = (status) => {
    return status === "available" ? "#2E7D32" : "white";
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch trình sân</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Court Selector */}
        <View style={styles.courtSelector}>
          <Text style={styles.sectionTitle}>Chọn sân</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courts.map((court) => (
              <TouchableOpacity
                key={court}
                style={[
                  styles.courtTab,
                  selectedCourt === court && styles.courtTabActive,
                ]}
                onPress={() => setSelectedCourt(court)}
              >
                <Text
                  style={[
                    styles.courtTabText,
                    selectedCourt === court && styles.courtTabTextActive,
                  ]}
                >
                  {court}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weekDates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateTab,
                  selectedDate.toDateString() === date.toDateString() &&
                    styles.dateTabActive,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate.toDateString() === date.toDateString() &&
                      styles.dayTextActive,
                  ]}
                >
                  {getDayName(date)}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    selectedDate.toDateString() === date.toDateString() &&
                      styles.dateTextActive,
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Schedule Info */}
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleTitle}>
            {selectedCourt} - {formatDate(selectedDate)}
          </Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>Trống</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF5722" }]}
              />
              <Text style={styles.legendText}>Đã đặt</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#9E9E9E" }]}
              />
              <Text style={styles.legendText}>Khóa</Text>
            </View>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((time) => {
            const status = getSlotStatus(time);
            const booking = bookings[time];

            return (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  { backgroundColor: getSlotColor(status) },
                ]}
              >
                <View style={styles.timeSlotHeader}>
                  <Text
                    style={[
                      styles.timeText,
                      { color: getSlotTextColor(status) },
                    ]}
                  >
                    {time} - {Number.parseInt(time.split(":")[0]) + 1}:00
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          status === "available"
                            ? "#E8F5E8"
                            : "rgba(255,255,255,0.2)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: status === "available" ? "#2E7D32" : "white" },
                      ]}
                    >
                      {status === "available"
                        ? "Trống"
                        : status === "booked"
                        ? "Đã đặt"
                        : "Khóa"}
                    </Text>
                  </View>
                </View>

                {booking && (
                  <View style={styles.bookingDetails}>
                    {booking.customer && (
                      <Text style={styles.customerName}>
                        👤 {booking.customer}
                      </Text>
                    )}
                    {booking.phone && (
                      <Text style={styles.customerPhone}>
                        📞 {booking.phone}
                      </Text>
                    )}
                    {booking.reason && (
                      <Text style={styles.blockReason}>
                        ⚠️ {booking.reason}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Tổng quan ngày</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {
                  timeSlots.filter(
                    (time) => getSlotStatus(time) === "available"
                  ).length
                }
              </Text>
              <Text style={styles.statLabel}>Slot trống</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {
                  timeSlots.filter((time) => getSlotStatus(time) === "booked")
                    .length
                }
              </Text>
              <Text style={styles.statLabel}>Đã đặt</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {
                  timeSlots.filter((time) => getSlotStatus(time) === "blocked")
                    .length
                }
              </Text>
              <Text style={styles.statLabel}>Bị khóa</Text>
            </View>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  courtSelector: {
    marginTop: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  courtTab: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  courtTabActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  courtTabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  courtTabTextActive: {
    color: "white",
  },
  dateSelector: {
    marginBottom: 20,
  },
  dateTab: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 60,
  },
  dateTabActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  dayText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  dayTextActive: {
    color: "white",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginTop: 2,
  },
  dateTextActive: {
    color: "white",
  },
  scheduleInfo: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  timeSlot: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeSlotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bookingDetails: {
    marginTop: 4,
  },
  customerName: {
    fontSize: 14,
    color: "white",
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  blockReason: {
    fontSize: 12,
    color: "white",
    fontStyle: "italic",
  },
  summary: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
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
  },
});

export default CourtScheduleScreen;