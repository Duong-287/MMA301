"use client";

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
} from "react-native";
import { courtAPI } from "../../services/court";
import { bookingAPI } from "../../services/booking";

const BookingScreen = ({ navigation, route }) => {
  const { courtId, selectedDate } = route?.params || {};

  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDate, setBookingDate] = useState(selectedDate || new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    loadCourts();
  }, []);

  useEffect(() => {
    if (selectedCourt) {
      loadAvailableSlots();
    }
  }, [selectedCourt, bookingDate]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const response = await courtAPI.getAllCourts();

      if (response.success) {
        const activeCourts = response.data.filter(
          (court) => court.status === "active"
        );
        setCourts(activeCourts);

        // If courtId is provided, select that court
        if (courtId) {
          const court = activeCourts.find((c) => c._id === courtId);
          if (court) {
            setSelectedCourt(court);
          }
        } else if (activeCourts.length > 0) {
          setSelectedCourt(activeCourts[0]);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedCourt) return;

    try {
      const response = await bookingAPI.getCourtSchedule(
        selectedCourt._id,
        bookingDate
      );

      if (response.success) {
        // Generate time slots and check availability
        const slots = generateTimeSlots(
          selectedCourt.startTime,
          selectedCourt.endTime
        );
        const schedule =
          response.data[bookingDate.toISOString().split("T")[0]] || {};

        const availableSlots = slots.filter((slot) => {
          const slotInfo = schedule[slot];
          return !slotInfo || slotInfo.status === "available";
        });

        setAvailableSlots(availableSlots);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      setAvailableSlots([]);
    }
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = Number.parseInt(startTime.split(":")[0]);
    const end = Number.parseInt(endTime.split(":")[0]);

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
        endTime: `${Number.parseInt(selectedSlot.split(":")[0]) + 1}:00`,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        totalAmount: selectedCourt.pricePerHour + selectedCourt.serviceFee,
      };

      const response = await bookingAPI.createBooking(bookingData);

      if (response.success) {
        Alert.alert(
          "Thành công",
          "Đặt sân thành công! Vui lòng chờ xác nhận.",
          [
            {
              text: "OK",
              onPress: () => {
                setShowBookingModal(false);
                navigation.navigate("BookingHistory");
              },
            },
          ]
        );
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
    return amount?.toLocaleString() || "0";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Đang tải thông tin sân...</Text>
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
        <Text style={styles.headerTitle}>Đặt sân</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Court Selection */}
        <View style={styles.section}>
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
                <Text style={styles.courtPrice}>
                  {formatCurrency(court.pricePerHour)} VNĐ/giờ
                </Text>
                <Text style={styles.courtTime}>
                  {court.startTime} - {court.endTime}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateText}>{formatDate(bookingDate)}</Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* Time Slots */}
        {selectedCourt && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
            <View style={styles.slotsGrid}>
              {availableSlots.map((slot) => (
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
                    {slot} - {Number.parseInt(slot.split(":")[0]) + 1}:00
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {availableSlots.length === 0 && (
              <View style={styles.noSlotsContainer}>
                <Text style={styles.noSlotsText}>Không có khung giờ trống</Text>
              </View>
            )}
          </View>
        )}

        {/* Booking Summary */}
        {selectedCourt && selectedSlot && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sân:</Text>
                <Text style={styles.summaryValue}>{selectedCourt.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ngày:</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(bookingDate)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giờ:</Text>
                <Text style={styles.summaryValue}>
                  {selectedSlot} -{" "}
                  {Number.parseInt(selectedSlot.split(":")[0]) + 1}:00
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giá sân:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(selectedCourt.pricePerHour)} VNĐ
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí dịch vụ:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(selectedCourt.serviceFee)} VNĐ
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(
                    selectedCourt.pricePerHour + selectedCourt.serviceFee
                  )}{" "}
                  VNĐ
                </Text>
              </View>
            </View>
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

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin khách hàng</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.textInput}
                  value={customerInfo.name}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, name: text })
                  }
                  placeholder="Nhập họ và tên"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.textInput}
                  value={customerInfo.phone}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, phone: text })
                  }
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={customerInfo.email}
                  onChangeText={(text) =>
                    setCustomerInfo({ ...customerInfo, email: text })
                  }
                  placeholder="Nhập email (tùy chọn)"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleBooking}
              >
                <Text style={styles.confirmButtonText}>Xác nhận đặt sân</Text>
              </TouchableOpacity>
            </ScrollView>
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
