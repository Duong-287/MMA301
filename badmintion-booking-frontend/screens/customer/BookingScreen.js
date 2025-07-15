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
  TextInput,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCourtById } from "../../services/court";
import { bookingAPI } from "../../services/booking";

const BookingScreen = ({ navigation, route }) => {
  const { courtId, selectedDate } = route?.params || {};
  console.log("📌 Route params:", route?.params);
  console.log("📌 courtId:", courtId);

  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadCourts();
    console.log("🔄 Đang load thông tin sân...");
  }, []);

  useEffect(() => {
    console.log(
      "📣 useEffect triggered - selectedCourt:",
      selectedCourt,
      "bookingDate:",
      bookingDate
    );
    if (selectedCourt && bookingDate) {
      loadAvailableSlots();
    }
  }, [selectedCourt, bookingDate]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      let courtList = [];

      if (courtId) {
        const response = await getCourtById(courtId);
        console.log("📌 API getCourtById response:", response);

        if (response.success) {
          courtList = [response.data.court];
        }
      }

      const activeCourts = courtList.filter(
        (court) => court.status === "active"
      );
      console.log("📌 Active courts:", activeCourts);

      setCourts(activeCourts);

      if (courtId) {
        const court = activeCourts.find((c) => c._id === courtId);
        if (court) {
          console.log("📌 Selected court:", court);
          setSelectedCourt(court);
          setTimeout(() => loadAvailableSlots(), 0);
        }
      } else if (activeCourts.length > 0) {
        setSelectedCourt(activeCourts[0]);
      }
    } catch (error) {
      console.log("❌ Lỗi khi load sân:", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedCourt || !bookingDate) return;
    console.log("📌 Bắt đầu loadAvailableSlots");
    console.log("📌 Court:", selectedCourt);
    console.log("📌 Ngày:", bookingDate);
    try {
      const response = await bookingAPI.getCourtSchedule(
        selectedCourt._id,
        bookingDate
      );
      console.log("📌 Load slots for:", selectedCourt.name, bookingDate);
      if (response.success) {
        const slots = generateTimeSlots(
          selectedCourt.startTime,
          selectedCourt.endTime
        );
        console.log("📌 Tất cả khung giờ có thể:", slots);
        const schedule =
          response.data[bookingDate.toISOString().split("T")[0]] || {};
        console.log("📌 Lịch đặt sân hiện có:", schedule);
        const availableSlots = slots.filter((slot) => {
          const slotInfo = schedule[slot];
          return !slotInfo || slotInfo.status === "available";
        });
        console.log("📌 Khung giờ còn trống:", availableSlots);
        setAvailableSlots(availableSlots);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      setAvailableSlots([]);
    }
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedCourt) {
      Alert.alert("Lỗi", "Vui lòng chọn sân và khung giờ");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const bookingData = {
        courtId: selectedCourt._id,
        date: bookingDate.toISOString().split("T")[0],
        startTime: selectedSlot,
        endTime: `${parseInt(selectedSlot.split(":")[0]) + 1}:00`,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        totalAmount:
          parseInt(selectedCourt.pricePerHour) +
          parseInt(selectedCourt.serviceFee),
      };
      console.log("📤 Dữ liệu gửi booking:", bookingData);
      const response = await bookingAPI.createBooking(bookingData);
      console.log("✅ Booking thành công:", response);
      if (response.success) {
        Alert.alert("Thành công", "Đặt sân thành công!", [
          {
            text: "OK",
            onPress: () => {
              setShowBookingModal(false);
              navigation.navigate("BookingHistory");
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + " VNĐ";
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBookingDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt sân</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Court List */}
        <Text style={styles.sectionTitle}>Chọn sân</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {courts.map((court) => (
            <TouchableOpacity
              key={court._id}
              style={[
                styles.courtCard,
                selectedCourt?._id === court._id && styles.courtCardSelected,
              ]}
              onPress={() => setSelectedCourt(court)}
            >
              <Text style={styles.courtName}>{court.name}</Text>
              <Text>{formatCurrency(court.pricePerHour)} / giờ</Text>
              <Text>
                {court.startTime} - {court.endTime}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date Picker */}
        <Text style={styles.sectionTitle}>Chọn ngày</Text>
        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(bookingDate)}</Text>
          <Text style={styles.dateIcon}>📅</Text>
        </TouchableOpacity>
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* iOS Date Picker (hiển thị luôn trong giao diện) */}
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            style={{ backgroundColor: "white", marginTop: 10 }}
          />
        )}

        {/* Slot Selection */}
        <Text style={styles.sectionTitle}>Khung giờ</Text>
        <View style={styles.slotsGrid}>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotButton,
                  selectedSlot === slot && styles.slotButtonSelected,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === slot && styles.slotTextSelected,
                  ]}
                >
                  {slot} - {parseInt(slot.split(":")[0]) + 1}:00
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Không có khung giờ trống</Text>
          )}
        </View>

        {/* Booking Info */}
        {selectedCourt && selectedSlot && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
            <Text>Sân: {selectedCourt.name}</Text>
            <Text>Ngày: {formatDate(bookingDate)}</Text>
            <Text>
              Giờ: {selectedSlot} - {parseInt(selectedSlot.split(":")[0]) + 1}
              :00
            </Text>
            <Text>Giá: {formatCurrency(selectedCourt.pricePerHour)}</Text>
            <Text>Phí dịch vụ: {formatCurrency(selectedCourt.serviceFee)}</Text>
            <Text style={{ fontWeight: "bold" }}>
              Tổng cộng:{" "}
              {formatCurrency(
                parseInt(selectedCourt.pricePerHour) +
                  parseInt(selectedCourt.serviceFee)
              )}
            </Text>
          </View>
        )}

        {/* Book Button */}
        {selectedCourt && selectedSlot && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setShowBookingModal(true)}
          >
            <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin khách hàng</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Họ và tên"
              value={customerInfo.name}
              onChangeText={(text) =>
                setCustomerInfo({ ...customerInfo, name: text })
              }
            />
            <TextInput
              style={styles.textInput}
              placeholder="Số điện thoại"
              value={customerInfo.phone}
              onChangeText={(text) =>
                setCustomerInfo({ ...customerInfo, phone: text })
              }
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={customerInfo.email}
              onChangeText={(text) =>
                setCustomerInfo({ ...customerInfo, email: text })
              }
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleBooking}
            >
              <Text style={styles.confirmButtonText}>Xác nhận đặt sân</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Text
                style={{ textAlign: "center", marginTop: 10, color: "red" }}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  courtCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courtCardSelected: {
    borderColor: "#2E7D32",
  },
  courtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  courtPrice: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 2,
  },
  courtTime: {
    fontSize: 12,
    color: "#666",
  },
  dateSelector: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dateIcon: {
    fontSize: 20,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 120,
    alignItems: "center",
  },
  slotButtonSelected: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  slotText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  slotTextSelected: {
    color: "white",
  },
  noSlotsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  noSlotsText: {
    fontSize: 16,
    color: "#666",
  },
  summarySection: {
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#2E7D32",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  bookButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
    elevation: 3,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "transparent",
  },
  confirmButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;
