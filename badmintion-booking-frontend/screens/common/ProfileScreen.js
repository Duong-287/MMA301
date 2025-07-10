import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock icons - trong thực tế bạn sẽ sử dụng react-native-vector-icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
);

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    booking: true,
    reminder: true,
    promotion: false,
  });

  const [profile, setProfile] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123 456 789",
    location: "Hà Nội",
    level: "Trung bình",
    position: "Đánh đôi",
    experience: "3 năm",
    bio: "Yêu thích cầu lông, thường chơi vào cuối tuần. Tìm kiếm đối thủ cùng trình độ để cùng luyện tập.",
  });

  const stats = [
    { label: "Trận đã chơi", value: "127", icon: "T", color: "#F59E0B" },
    { label: "Giờ chơi", value: "89h", icon: "C", color: "#3B82F6" },
    { label: "Sân yêu thích", value: "A1", icon: "S", color: "#10B981" },
    { label: "Tỷ lệ thắng", value: "68%", icon: "%", color: "#8B5CF6" },
  ];

  const recentBookings = [
    {
      date: "15/12/2024",
      time: "19:00 - 20:30",
      court: "Sân A1",
      status: "Hoàn thành",
      statusColor: "#10B981",
    },
    {
      date: "12/12/2024",
      time: "18:00 - 19:30",
      court: "Sân B2",
      status: "Hoàn thành",
      statusColor: "#10B981",
    },
    {
      date: "08/12/2024",
      time: "20:00 - 21:30",
      court: "Sân A1",
      status: "Đã hủy",
      statusColor: "#EF4444",
    },
  ];

  const achievements = [
    { title: "Người chơi tích cực", icon: "T", color: "#F59E0B" },
    { title: "Đánh giá 5 sao", icon: "★", color: "#3B82F6" },
    { title: "100 trận", icon: "1", color: "#10B981" },
  ];

  const tabs = [
    { id: "info", label: "Thông tin", icon: "U" },
    { id: "history", label: "Lịch sử", icon: "H" },
    { id: "achievements", label: "Thành tích", icon: "A" },
    { id: "settings", label: "Cài đặt", icon: "S" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Thành công", "Thông tin đã được cập nhật!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>
        <TouchableOpacity style={styles.cameraButton}>
          <Icon name="camera" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{profile.level}</Text>
          </View>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Icon name="mail" size={14} color="#666" />
            <Text style={styles.contactText}>{profile.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" size={14} color="#666" />
            <Text style={styles.contactText}>{profile.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="location" size={14} color="#666" />
            <Text style={styles.contactText}>{profile.location}</Text>
          </View>
        </View>

        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Icon name={isEditing ? "save" : "edit"} size={16} color="#fff" />
        <Text style={styles.editButtonText}>
          {isEditing ? "Lưu" : "Chỉnh sửa"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <View
            style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}
          >
            <Text style={[styles.statIconText, { color: stat.color }]}>
              {stat.icon}
            </Text>
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Icon
            name={tab.icon}
            size={16}
            color={activeTab === tab.id ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="user" size={20} color="#10B981" />
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Họ và tên</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.name}
            onChangeText={(value) => handleInputChange("name", value)}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.email}
            onChangeText={(value) => handleInputChange("email", value)}
            editable={isEditing}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Địa điểm</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.location}
            onChangeText={(value) => handleInputChange("location", value)}
            editable={isEditing}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="target" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Thông tin cầu lông</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Trình độ</Text>
          <View style={[styles.input, !isEditing && styles.disabledInput]}>
            <Text style={styles.inputText}>{profile.level}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Vị trí ưa thích</Text>
          <View style={[styles.input, !isEditing && styles.disabledInput]}>
            <Text style={styles.inputText}>{profile.position}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Kinh nghiệm</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.experience}
            onChangeText={(value) => handleInputChange("experience", value)}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Giới thiệu bản thân</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              !isEditing && styles.disabledInput,
            ]}
            value={profile.bio}
            onChangeText={(value) => handleInputChange("bio", value)}
            editable={isEditing}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Icon name="calendar" size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Lịch sử đặt sân</Text>
      </View>

      {recentBookings.map((booking, index) => (
        <View key={index} style={styles.bookingCard}>
          <View style={styles.bookingInfo}>
            <View style={styles.bookingIcon}>
              <Icon name="calendar" size={16} color="#10B981" />
            </View>
            <View style={styles.bookingDetails}>
              <Text style={styles.bookingCourt}>{booking.court}</Text>
              <Text style={styles.bookingTime}>
                {booking.date} • {booking.time}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: booking.statusColor + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: booking.statusColor }]}>
              {booking.status}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Huy hiệu</Text>
        </View>

        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.color + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.achievementIconText,
                    { color: achievement.color },
                  ]}
                >
                  {achievement.icon}
                </Text>
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê chi tiết</Text>
        <View style={styles.detailStats}>
          <View style={styles.detailStatRow}>
            <Text style={styles.detailStatLabel}>
              Thời gian chơi trung bình
            </Text>
            <Text style={styles.detailStatValue}>1.5 giờ/trận</Text>
          </View>
          <View style={styles.detailStatRow}>
            <Text style={styles.detailStatLabel}>Sân được đặt nhiều nhất</Text>
            <Text style={styles.detailStatValue}>Sân A1</Text>
          </View>
          <View style={styles.detailStatRow}>
            <Text style={styles.detailStatLabel}>Khung giờ ưa thích</Text>
            <Text style={styles.detailStatValue}>19:00 - 21:00</Text>
          </View>
          <View style={styles.detailStatRow}>
            <Text style={styles.detailStatLabel}>Đối thủ thường xuyên</Text>
            <Text style={styles.detailStatValue}>Trần Văn B</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="bell" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Thông báo</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Thông báo đặt sân</Text>
            <Text style={styles.settingDescription}>
              Nhận thông báo khi đặt sân thành công
            </Text>
          </View>
          <Switch
            value={notifications.booking}
            onValueChange={(value) =>
              setNotifications((prev) => ({ ...prev, booking: value }))
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Nhắc nhở trước trận</Text>
            <Text style={styles.settingDescription}>
              Nhắc nhở 30 phút trước giờ chơi
            </Text>
          </View>
          <Switch
            value={notifications.reminder}
            onValueChange={(value) =>
              setNotifications((prev) => ({ ...prev, reminder: value }))
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Khuyến mãi</Text>
            <Text style={styles.settingDescription}>
              Nhận thông báo về các chương trình khuyến mãi
            </Text>
          </View>
          <Switch
            value={notifications.promotion}
            onValueChange={(value) =>
              setNotifications((prev) => ({ ...prev, promotion: value }))
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="shield" size={20} color="#10B981" />
          <Text style={styles.sectionTitle}>Bảo mật</Text>
        </View>

        <TouchableOpacity style={styles.securityButton}>
          <Text style={styles.securityButtonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.securityButton}>
          <Text style={styles.securityButtonText}>Xác thực hai bước</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.securityButton}>
          <Text style={styles.securityButtonText}>
            Quản lý thiết bị đăng nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.securityButton, styles.dangerButton]}>
          <Text style={[styles.securityButtonText, styles.dangerButtonText]}>
            Xóa tài khoản
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return renderPersonalInfo();
      case "history":
        return renderHistory();
      case "achievements":
        return renderAchievements();
      case "settings":
        return renderSettings();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderStats()}
        {renderTabs()}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
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
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 8,
    right: width / 2 - 50,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "#065F46",
    fontSize: 12,
    fontWeight: "600",
  },
  contactInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  contactText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 14,
  },
  bio: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
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
  disabledInput: {
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },
  inputText: {
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 12,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bookingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingCourt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  bookingTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "30%",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  achievementIconText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  achievementTitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#374151",
    fontWeight: "500",
  },
  detailStats: {
    marginTop: 16,
  },
  detailStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailStatLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  securityButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 12,
  },
  securityButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  dangerButton: {
    borderColor: "#FCA5A5",
  },
  dangerButtonText: {
    color: "#DC2626",
  },
});
