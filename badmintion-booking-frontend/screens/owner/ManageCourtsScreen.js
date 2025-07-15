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
  RefreshControl,
  TextInput,
  Image,
} from "react-native";
import {
  deleteCourt,
  getCourtsByOwner,
  updateCourtStatus,
} from "../../services/court";

const ManageCourtsScreen = ({ navigation, route }) => {
  const { ownerId } = route?.params || {};

  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, active, waiting

  useEffect(() => {
    loadCourts();
  }, [ownerId]);

  useEffect(() => {
    filterCourts();
  }, [courts, searchQuery, selectedFilter]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const response = await getCourtsByOwner(ownerId);

      if (response.success) {
        setCourts(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourts();
    setRefreshing(false);
  };

  const filterCourts = () => {
    let filtered = courts;

    // Filter by status
    if (selectedFilter !== "all") {
      filtered = filtered.filter((court) => court.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourts(filtered);
  };

  const handleEditCourt = (court) => {
    navigation.navigate("EditCourt", {
      courtId: court._id,
      isNewCourt: false,
    });
  };

  const handleViewSchedule = (court) => {
    navigation.navigate("CourtSchedule", {
      ownerId: ownerId,
      courtId: court._id,
    });
  };

  const handleToggleStatus = async (court) => {
    const newStatus = court.status === "active" ? "waiting" : "active";
    const statusText = newStatus === "active" ? "kích hoạt" : "tạm dừng";

    Alert.alert(
      "Xác nhận",
      `Bạn có chắc chắn muốn ${statusText} sân "${court.name}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              await updateCourtStatus(court._id, newStatus);
              Alert.alert("Thành công", `Đã ${statusText} sân thành công`);
              loadCourts();
            } catch (error) {
              Alert.alert("Lỗi", error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteCourt = async (court) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa sân "${court.name}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCourt(court._id);
              Alert.alert("Thành công", "Đã xóa sân thành công");
              loadCourts();
            } catch (error) {
              Alert.alert("Lỗi", error.message);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    return status === "active" ? "#4CAF50" : "#FF9800";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Chờ duyệt";
  };

  const getIconDisplay = (iconName) => {
    const iconMap = {
      activity: "🏸",
      target: "🎯",
      thermometer: "🌡️",
      "volume-2": "🔊",
      sun: "💡",
      home: "🏠",
      coffee: "☕",
      car: "🚗",
      wifi: "📶",
      droplet: "💧",
      star: "⭐",
      heart: "❤️",
      shield: "🛡️",
    };
    return iconMap[iconName] || "⭐";
  };

  const renderCourtCard = (court) => (
    <View key={court._id} style={styles.courtCard}>
      {/* Court Images */}
      {court.images && court.images.length > 0 && (
        <View style={styles.imagesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesList}
          >
            {court.images.slice(0, 4).map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: `http://192.168.1.18:3000/uploads/${imageUrl}` }}
                style={styles.courtImage}
              />
            ))}
          </ScrollView>
          {court.images.length > 4 && (
            <View style={styles.moreImagesOverlay}>
              <Text style={styles.moreImagesText}>
                +{court.images.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.courtCardContent}>
        <View style={styles.courtCardHeader}>
          <View style={styles.courtInfo}>
            <Text style={styles.courtName}>{court.name}</Text>
            <Text style={styles.courtAddress}>{court.address}</Text>

            {/* Description */}
            {court.description && (
              <Text style={styles.courtDescription} numberOfLines={2}>
                {court.description}
              </Text>
            )}

            <View style={styles.courtMeta}>
              <Text style={styles.courtMetaText}>
                🕐 {court.startTime} - {court.endTime}
              </Text>
              <Text style={styles.courtMetaText}>
                💰 {court.pricePerHour?.toLocaleString()} VNĐ/giờ
              </Text>
              {court.serviceFee > 0 && (
                <Text style={styles.courtMetaText}>
                  📋 Phí dịch vụ: {court.serviceFee?.toLocaleString()} VNĐ
                </Text>
              )}
            </View>
          </View>

          <View style={styles.courtActions}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(court.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(court.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Facilities */}
        {court.facilities && court.facilities.length > 0 && (
          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Tiện nghi:</Text>
            <View style={styles.facilitiesList}>
              {court.facilities.slice(0, 6).map((facility, index) => (
                <View
                  key={index}
                  style={[
                    styles.facilityTag,
                    !facility.available && styles.facilityTagUnavailable,
                  ]}
                >
                  <Text style={styles.facilityTagIcon}>
                    {getIconDisplay(facility.icon)}
                  </Text>
                  <Text
                    style={[
                      styles.facilityTagText,
                      !facility.available && styles.facilityTagTextUnavailable,
                    ]}
                  >
                    {facility.name}
                  </Text>
                  {!facility.available && (
                    <Text style={styles.unavailableIcon}>⚠️</Text>
                  )}
                </View>
              ))}
              {court.facilities.length > 6 && (
                <View style={styles.facilityTag}>
                  <Text style={styles.facilityTagText}>
                    +{court.facilities.length - 6}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Rules Preview */}
        {court.rules && court.rules.length > 0 && (
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>📋 Quy định:</Text>
            <Text style={styles.ruleText} numberOfLines={1}>
              • {court.rules[0]}
            </Text>
            {court.rules.length > 1 && (
              <Text style={styles.moreRules}>
                +{court.rules.length - 1} quy định khác
              </Text>
            )}
          </View>
        )}

        {/* Policies Preview */}
        {court.policies && court.policies.length > 0 && (
          <View style={styles.policiesContainer}>
            <Text style={styles.policiesTitle}>🎁 Ưu đãi:</Text>
            <Text style={styles.policyText} numberOfLines={1}>
              {court.policies[0]}
            </Text>
            {court.policies.length > 1 && (
              <Text style={styles.morePolicies}>
                +{court.policies.length - 1} ưu đãi khác
              </Text>
            )}
          </View>
        )}

        <View style={styles.courtCardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewSchedule(court)}
          >
            <Text style={styles.actionButtonText}>📅 Lịch trình</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditCourt(court)}
          >
            <Text style={styles.actionButtonText}>✏️ Chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleStatus(court)}
          >
            <Text style={styles.actionButtonText}>
              {court.status === "active" ? "⏸️ Tạm dừng" : "▶️ Kích hoạt"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCourt(court)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              🗑️ Xóa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Đang tải danh sách sân...</Text>
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
        <Text style={styles.headerTitle}>Quản lý sân</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("EditCourt", { isNewCourt: true })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sân..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "all" && styles.filterTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "active" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "active" && styles.filterTextActive,
              ]}
            >
              Hoạt động
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "waiting" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("waiting")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "waiting" && styles.filterTextActive,
              ]}
            >
              Chờ duyệt
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Courts List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{courts.length}</Text>
            <Text style={styles.statLabel}>Tổng sân</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {courts.filter((c) => c.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>Hoạt động</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {courts.filter((c) => c.status === "waiting").length}
            </Text>
            <Text style={styles.statLabel}>Chờ duyệt</Text>
          </View>
        </View>

        {/* Courts */}
        {filteredCourts.length > 0 ? (
          filteredCourts.map(renderCourtCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏸</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? "Không tìm thấy sân nào"
                : "Chưa có sân nào"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery.trim()
                ? "Thử tìm kiếm với từ khóa khác"
                : "Tạo sân đầu tiên của bạn"}
            </Text>
            {!searchQuery.trim() && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() =>
                  navigation.navigate("EditCourt", { isNewCourt: true })
                }
              >
                <Text style={styles.createButtonText}>Tạo sân mới</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterChip: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
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
  courtCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  imagesContainer: {
    position: "relative",
  },
  imagesList: {
    height: 120,
  },
  courtImage: {
    width: 120,
    height: 120,
    marginRight: 8,
  },
  moreImagesOverlay: {
    position: "absolute",
    right: 8,
    top: 0,
    width: 120,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  courtCardContent: {
    padding: 16,
  },
  courtCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courtInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  courtAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  courtDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  courtMeta: {
    gap: 4,
    marginBottom: 8,
  },
  courtMetaText: {
    fontSize: 12,
    color: "#666",
  },
  courtActions: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  facilitiesContainer: {
    marginBottom: 12,
  },
  facilitiesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  facilitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  facilityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  facilityTagUnavailable: {
    backgroundColor: "#FFEBEE",
  },
  facilityTagIcon: {
    fontSize: 10,
    marginRight: 3,
  },
  facilityTagText: {
    fontSize: 10,
    color: "#2E7D32",
    fontWeight: "500",
  },
  facilityTagTextUnavailable: {
    color: "#F44336",
  },
  unavailableIcon: {
    fontSize: 8,
    marginLeft: 2,
  },
  rulesContainer: {
    marginBottom: 8,
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  moreRules: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  policiesContainer: {
    marginBottom: 12,
  },
  policiesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  policyText: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "500",
    lineHeight: 16,
  },
  morePolicies: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  courtCardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
  },
  deleteButtonText: {
    color: "#f44336",
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
  },
  createButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ManageCourtsScreen;