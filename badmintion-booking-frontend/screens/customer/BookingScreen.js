import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock icons - trong thực tế bạn sẽ sử dụng react-native-vector-icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
)

const { width } = Dimensions.get("window")

export default function BookingScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(90) // minutes
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    playerName: "Nguyễn Văn An",
    phone: "0123 456 789",
    email: "nguyenvanan@email.com",
    note: "",
  })

  // Mock data - trong thực tế sẽ fetch từ API
  const courts = [
    { id: 1, name: "Sân A1", type: "Sân đơn", price: 80000, available: true },
    { id: 2, name: "Sân A2", type: "Sân đôi", price: 100000, available: true },
    { id: 3, name: "Sân B1", type: "Sân đơn", price: 80000, available: false },
    { id: 4, name: "Sân B2", type: "Sân đôi", price: 100000, available: true },
    { id: 5, name: "Sân C1", type: "Sân VIP", price: 150000, available: true },
    { id: 6, name: "Sân C2", type: "Sân VIP", price: 150000, available: true },
  ]

  const timeSlots = [
    { id: 1, time: "06:00", available: true, peak: false },
    { id: 2, time: "07:30", available: true, peak: false },
    { id: 3, time: "09:00", available: false, peak: false },
    { id: 4, time: "10:30", available: true, peak: false },
    { id: 5, time: "12:00", available: true, peak: false },
    { id: 6, time: "13:30", available: true, peak: false },
    { id: 7, time: "15:00", available: true, peak: false },
    { id: 8, time: "16:30", available: true, peak: false },
    { id: 9, time: "18:00", available: true, peak: true },
    { id: 10, time: "19:30", available: false, peak: true },
    { id: 11, time: "21:00", available: true, peak: true },
  ]

  const durations = [
    { value: 60, label: "1 giờ", multiplier: 0.7 },
    { value: 90, label: "1.5 giờ", multiplier: 1.0 },
    { value: 120, label: "2 giờ", multiplier: 1.8 },
  ]

  // Generate calendar dates
  const generateCalendarDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const calendarDates = generateCalendarDates()

  const formatDate = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: date.toLocaleDateString("vi-VN"),
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedCourt || !selectedTimeSlot) return 0

    const court = courts.find((c) => c.id === selectedCourt)
    const timeSlot = timeSlots.find((t) => t.id === selectedTimeSlot)
    const duration = durations.find((d) => d.value === selectedDuration)

    if (!court || !timeSlot || !duration) return 0

    let basePrice = court.price * duration.multiplier

    // Peak hour surcharge
    if (timeSlot.peak) {
      basePrice *= 1.2
    }

    return Math.round(basePrice)
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedCourt) {
      Alert.alert("Thông báo", "Vui lòng chọn đầy đủ thông tin đặt sân!")
      return
    }

    if (!bookingForm.playerName || !bookingForm.phone) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin liên hệ!")
      return
    }

    const court = courts.find((c) => c.id === selectedCourt)
    const timeSlot = timeSlots.find((t) => t.id === selectedTimeSlot)
    const totalPrice = calculateTotalPrice()

    Alert.alert(
      "Xác nhận đặt sân",
      `Sân: ${court.name}\nNgày: ${formatDate(selectedDate).fullDate}\nGiờ: ${timeSlot.time}\nThời gian: ${selectedDuration} phút\nTổng tiền: ${totalPrice.toLocaleString("vi-VN")}đ\n\nBạn có muốn xác nhận đặt sân?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            Alert.alert("Thành công", "Đặt sân thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.")
            // Reset form
            setSelectedTimeSlot(null)
            setSelectedCourt(null)
          },
        },
      ],
    )
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Đặt sân cầu lông</Text>
      <View style={styles.headerRight} />
    </View>
  )

  const renderCalendar = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="calendar" size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Chọn ngày</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
        {calendarDates.map((date, index) => {
          const dateInfo = formatDate(date)
          const isSelected = selectedDate.toDateString() === date.toDateString()
          const isToday = new Date().toDateString() === date.toDateString()

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                isSelected && styles.selectedDateCard,
                isToday && !isSelected && styles.todayDateCard,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                ]}
              >
                {dateInfo.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                ]}
              >
                {dateInfo.date}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                ]}
              >
                T{dateInfo.month}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )

  const renderTimeSlots = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="clock" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>Chọn giờ chơi</Text>
      </View>

      <View style={styles.timeSlotsGrid}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.timeSlot,
              !slot.available && styles.unavailableTimeSlot,
              selectedTimeSlot === slot.id && styles.selectedTimeSlot,
              slot.peak && slot.available && styles.peakTimeSlot,
            ]}
            onPress={() => slot.available && setSelectedTimeSlot(slot.id)}
            disabled={!slot.available}
          >
            <Text
              style={[
                styles.timeSlotText,
                !slot.available && styles.unavailableTimeSlotText,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
              ]}
            >
              {slot.time}
            </Text>
            {slot.peak && slot.available && <Text style={styles.peakLabel}>Giờ cao điểm</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderDuration = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="timer" size={20} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Thời gian chơi</Text>
      </View>

      <View style={styles.durationContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration.value}
            style={[styles.durationCard, selectedDuration === duration.value && styles.selectedDurationCard]}
            onPress={() => setSelectedDuration(duration.value)}
          >
            <Text style={[styles.durationText, selectedDuration === duration.value && styles.selectedDurationText]}>
              {duration.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderCourts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="court" size={20} color="#8B5CF6" />
        <Text style={styles.sectionTitle}>Chọn sân</Text>
      </View>

      <View style={styles.courtsGrid}>
        {courts.map((court) => (
          <TouchableOpacity
            key={court.id}
            style={[
              styles.courtCard,
              !court.available && styles.unavailableCourtCard,
              selectedCourt === court.id && styles.selectedCourtCard,
            ]}
            onPress={() => court.available && setSelectedCourt(court.id)}
            disabled={!court.available}
          >
            <View style={styles.courtInfo}>
              <Text
                style={[
                  styles.courtName,
                  !court.available && styles.unavailableCourtText,
                  selectedCourt === court.id && styles.selectedCourtText,
                ]}
              >
                {court.name}
              </Text>
              <Text
                style={[
                  styles.courtType,
                  !court.available && styles.unavailableCourtText,
                  selectedCourt === court.id && styles.selectedCourtText,
                ]}
              >
                {court.type}
              </Text>
              <Text
                style={[
                  styles.courtPrice,
                  !court.available && styles.unavailableCourtText,
                  selectedCourt === court.id && styles.selectedCourtText,
                ]}
              >
                {court.price.toLocaleString("vi-VN")}đ/1.5h
              </Text>
            </View>

            {!court.available && (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableBadgeText}>Đã đặt</Text>
              </View>
            )}

            {selectedCourt === court.id && (
              <View style={styles.selectedBadge}>
                <Icon name="check" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderBookingForm = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="user" size={20} color="#EF4444" />
        <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            value={bookingForm.playerName}
            onChangeText={(text) => setBookingForm((prev) => ({ ...prev, playerName: text }))}
            placeholder="Nhập họ và tên"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            value={bookingForm.phone}
            onChangeText={(text) => setBookingForm((prev) => ({ ...prev, phone: text }))}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={bookingForm.email}
            onChangeText={(text) => setBookingForm((prev) => ({ ...prev, email: text }))}
            placeholder="Nhập email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bookingForm.note}
            onChangeText={(text) => setBookingForm((prev) => ({ ...prev, note: text }))}
            placeholder="Ghi chú thêm (tùy chọn)"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </View>
  )

  const renderSummary = () => {
    const totalPrice = calculateTotalPrice()
    const court = courts.find((c) => c.id === selectedCourt)
    const timeSlot = timeSlots.find((t) => t.id === selectedTimeSlot)

    if (!court || !timeSlot) return null

    return (
      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Icon name="receipt" size={20} color="#10B981" />
          <Text style={styles.summaryTitle}>Tóm tắt đặt sân</Text>
        </View>

        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sân:</Text>
            <Text style={styles.summaryValue}>
              {court.name} ({court.type})
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ngày:</Text>
            <Text style={styles.summaryValue}>{formatDate(selectedDate).fullDate}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giờ:</Text>
            <Text style={styles.summaryValue}>{timeSlot.time}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thời gian:</Text>
            <Text style={styles.summaryValue}>{selectedDuration} phút</Text>
          </View>

          {timeSlot.peak && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phụ thu giờ cao điểm:</Text>
              <Text style={styles.summaryValue}>+20%</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalValue}>{totalPrice.toLocaleString("vi-VN")}đ</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCalendar()}
        {renderTimeSlots()}
        {renderDuration()}
        {renderCourts()}
        {renderBookingForm()}
        {renderSummary()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tổng tiền:</Text>
          <Text style={styles.priceValue}>{calculateTotalPrice().toLocaleString("vi-VN")}đ</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDate || !selectedTimeSlot || !selectedCourt) && styles.disabledBookButton,
          ]}
          onPress={handleBooking}
          disabled={!selectedDate || !selectedTimeSlot || !selectedCourt}
        >
          <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  calendarScroll: {
    marginHorizontal: -4,
  },
  dateCard: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 60,
  },
  selectedDateCard: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  todayDateCard: {
    borderColor: "#10B981",
    borderWidth: 2,
  },
  dayText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  monthText: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectedDateText: {
    color: "#fff",
  },
  todayDateText: {
    color: "#10B981",
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  timeSlot: {
    width: (width - 80) / 3,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedTimeSlot: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  unavailableTimeSlot: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  peakTimeSlot: {
    borderColor: "#F59E0B",
    borderWidth: 2,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  selectedTimeSlotText: {
    color: "#fff",
  },
  unavailableTimeSlotText: {
    color: "#9CA3AF",
  },
  peakLabel: {
    fontSize: 10,
    color: "#F59E0B",
    marginTop: 2,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedDurationCard: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  selectedDurationText: {
    color: "#fff",
  },
  courtsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  courtCard: {
    width: (width - 80) / 2,
    marginHorizontal: 4,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  selectedCourtCard: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  unavailableCourtCard: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  courtInfo: {
    alignItems: "center",
  },
  courtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  courtType: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  courtPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  selectedCourtText: {
    color: "#fff",
  },
  unavailableCourtText: {
    color: "#9CA3AF",
  },
  unavailableBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unavailableBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  summarySection: {
    backgroundColor: "#F0FDF4",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  summaryContent: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#BBF7D0",
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  bookButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  disabledBookButton: {
    backgroundColor: "#9CA3AF",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
