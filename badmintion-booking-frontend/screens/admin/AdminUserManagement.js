import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
);

export default function AdminUserManagement() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "Tất cả", count: 89 },
    { id: "active", label: "Hoạt động", count: 67 },
    { id: "new", label: "Mới", count: 12 },
    { id: "vip", label: "VIP", count: 8 },
    { id: "blocked", label: "Khóa", count: 2 },
  ];

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0123456789",
      joinDate: "15/10/2024",
      lastActive: "2 giờ trước",
      totalBookings: 15,
      totalSpent: 1800000,
      status: "active",
      level: "VIP",
      avatar: "A",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com",
      phone: "0987654321",
      joinDate: "20/11/2024",
      lastActive: "1 ngày trước",
      totalBookings: 8,
      totalSpent: 960000,
      status: "active",
      level: "Thường",
      avatar: "B",
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "levancuong@email.com",
      phone: "0369852147",
      joinDate: "12/12/2024",
      lastActive: "Vừa xong",
      totalBookings: 2,
      totalSpent: 240000,
      status: "new",
      level: "Mới",
      avatar: "C",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "new":
        return "#3B82F6";
      case "vip":
        return "#F59E0B";
      case "blocked":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "new":
        return "Mới";
      case "vip":
        return "VIP";
      case "blocked":
        return "Khóa";
      default:
        return status;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "VIP":
        return "#F59E0B";
      case "Thường":
        return "#10B981";
      case "Mới":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const handleUserAction = (userId, action) => {
    Alert.alert("Thông báo", `Tính năng ${action} đang được phát triển!`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.activeFilterText,
              ]}
            >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userLeft}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: getStatusColor(user.status) },
                  ]}
                >
                  <Text style={styles.avatarText}>{user.avatar}</Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: getLevelColor(user.level) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelText,
                          { color: getLevelColor(user.level) },
                        ]}
                      >
                        {user.level}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userPhone}>{user.phone}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(user.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(user.status) },
                  ]}
                >
                  {getStatusText(user.status)}
                </Text>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.totalBookings}</Text>
                <Text style={styles.statLabel}>Lượt đặt</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {user.totalSpent.toLocaleString("vi-VN")}đ
                </Text>
                <Text style={styles.statLabel}>Tổng chi tiêu</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.lastActive}</Text>
                <Text style={styles.statLabel}>Hoạt động cuối</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Icon name="calendar" size={14} color="#6B7280" />
                <Text style={styles.detailText}>Tham gia: {user.joinDate}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUserAction(user.id, "view")}
              >
                <Icon name="eye" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Xem</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUserAction(user.id, "edit")}
              >
                <Icon name="edit" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUserAction(user.id, "message")}
              >
                <Icon name="message" size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Nhắn tin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => handleUserAction(user.id, "block")}
              >
                <Icon name="block" size={16} color="#EF4444" />
                <Text style={[styles.actionButtonText, styles.dangerText]}>
                  Khóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
  userCard: {
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
  userHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  userPhone: {
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
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  userDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
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
  dangerButton: {
    // No additional styles needed
  },
  dangerText: {
    color: "#EF4444",
  },
});
