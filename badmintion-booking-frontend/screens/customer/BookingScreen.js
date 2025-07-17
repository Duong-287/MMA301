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
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking } from "../../services/booking";
import { getCourtById } from "../../services/court";
import { getUserProfile } from "../../services/customer";
import moment from "moment-timezone";
const BookingScreen = ({ navigation, route }) => {
  const { courtId } = route?.params || {};

  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    loadCustomerInfo();
  }, []);

  useEffect(() => {
    if (selectedCourt && bookingDate) {
      loadAvailableSlots();
    }
  }, [selectedCourt, bookingDate]);

  // Hiển thị thông tin sân cầu
  const loadCourts = async () => {
    try {
      setLoading(true);

      const res = await getCourtById(courtId);

      if (!res.success) {
        Alert.alert("Lỗi", res.message || "Không thể tải dữ liệu sân.");
        return;
      }

      const court = res.data.court || res.data;

      if (!court || court.status !== "active") {
        Alert.alert("Thông báo", "Sân không tồn tại hoặc đã bị vô hiệu.");
        return;
      }

      setCourts([court]);
      setSelectedCourt(court);

      setTimeout(() => loadAvailableSlots(), 0);
    } catch (error) {
      console.error("Lỗi tải sân:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải sân.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin người dùng
  const loadCustomerInfo = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("Chưa đăng nhập");
      return;
    }

    const res = await getUserProfile();
    if (res.success) {
      const { fullName, email, phone } = res.data;
      setCustomerInfo({
        name: fullName || "",
        phone: phone || "",
        email: email || "",
      });
    } else {
      Alert.alert("Lỗi", res.message);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedCourt || !bookingDate) return;

    // 🔒 Fake slot trống
    const slots = generateTimeSlots(
      selectedCourt.startTime,
      selectedCourt.endTime
    );
    const fakeTakenSlots = ["08:00", "10:00"];
    const available = slots.filter((slot) => !fakeTakenSlots.includes(slot));
    setAvailableSlots(available);
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

    const dateStr = moment(selectedDate).format("YYYY-MM-DD");
    const timeStr = selectedSlot;

    // 👉 Dùng moment-timezone để tạo đúng giờ Việt Nam
    const startMoment = moment.tz(
      `${dateStr} ${timeStr}`,
      "YYYY-MM-DD HH:mm",
      "Asia/Ho_Chi_Minh"
    );
    const endMoment = startMoment.clone().add(1, "hour");
    const localBookingDate = moment(bookingDate).format("YYYY-MM-DD");
    const bookingData = {
      courtId: selectedCourt._id,
      bookingDate: localBookingDate,
      startTime: startMoment.format(), // Hoặc format('YYYY-MM-DDTHH:mm:ss')
      endTime: endMoment.format(),
      name: customerInfo.name,
      phone: customerInfo.phone,
    };

    console.log("Booking data:", bookingData);

    const result = await createBooking(bookingData);

    if (result.success) {
      Alert.alert("Thành công", "Đặt sân thành công!", [
        {
          text: "OK",
          onPress: () => {
            setShowBookingModal(false);
            navigation.navigate("BookingHistory");
          },
        },
      ]);
    } else {
      Alert.alert("Lỗi", result.message || "Đặt sân thất bại");
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

  const onDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date); // chỉ cần 1 biến thôi
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
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            style={{ backgroundColor: "white", marginTop: 10 }}
          />
        )}

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

        {selectedCourt && selectedSlot && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
            <Text>Sân: {selectedCourt.name}</Text>
            <Text>Ngày: {formatDate(selectedDate)}</Text>
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

        {selectedCourt && selectedSlot && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={async () => {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert("Thông báo", "Bạn cần đăng nhập để đặt sân.", [
                  {
                    text: "Đăng nhập",
                    onPress: () => navigation.navigate("Login"),
                  },
                  { text: "Hủy", style: "cancel" },
                ]);
                return;
              }
              setShowBookingModal(true);
            }}
          >
            <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showBookingModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin khách hàng</Text>

            <TextInput
              placeholder="Họ và tên"
              style={styles.input}
              value={customerInfo.name}
              onChangeText={(text) =>
                setCustomerInfo({ ...customerInfo, name: text })
              }
            />

            <TextInput
              placeholder="Số điện thoại"
              style={styles.input}
              value={customerInfo.phone}
              onChangeText={(text) =>
                setCustomerInfo({ ...customerInfo, phone: text })
              }
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleBooking}
            >
              <Text style={styles.confirmButtonText}>Xác nhận đặt sân</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowBookingModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  confirmButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 32 : 16, // tránh đè lên thanh gạt
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  confirmButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: Platform.OS === "ios" ? 32 : 16, // tránh che bởi thanh gạt
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default BookingScreen;
