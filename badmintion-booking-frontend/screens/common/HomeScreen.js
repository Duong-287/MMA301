import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const SportsBookingApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header với background pattern */}
      <View style={styles.header}>
        {/* Background circles pattern */}
        <View style={styles.backgroundPattern}>
          <View
            style={[
              styles.circle,
              { top: -20, right: 50, width: 80, height: 80 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 20, right: -10, width: 60, height: 60 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 60, right: 80, width: 40, height: 40 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 10, right: 120, width: 30, height: 30 },
            ]}
          />
        </View>

        {/* Main header content */}
        <View style={styles.headerMain}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🌿</Text>
            </View>
            <Text style={styles.dateText}>Thứ hai, 23/06/2025</Text>
          </View>

          <View style={styles.authButtonsContainer}>
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn}>
              <Text style={styles.registerBtnText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Text style={styles.heartIcon}>🤍</Text>
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>Xe về gần tôi</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>Pickleball gần tôi</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>Cầu lông gần tôi</Text>
          </View>
        </ScrollView>

        {/* Sports categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sportsContainer}
        >
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#2196F3" }]}>
              <Text style={styles.sportEmoji}>🏓</Text>
            </View>
            <Text style={styles.sportName}>Pickleball</Text>
          </View>
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.sportEmoji}>🏸</Text>
            </View>
            <Text style={styles.sportName}>Cầu lông</Text>
          </View>
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.sportEmoji}>⚽</Text>
            </View>
            <Text style={styles.sportName}>Bóng đá</Text>
          </View>
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#FF9800" }]}>
              <Text style={styles.sportEmoji}>🎾</Text>
            </View>
            <Text style={styles.sportName}>Tennis</Text>
          </View>
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#FFC107" }]}>
              <Text style={styles.sportEmoji}>🏐</Text>
            </View>
            <Text style={styles.sportName}>B.Chuyền</Text>
          </View>
          <View style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#FFC107" }]}>
              <Text style={styles.sportEmoji}>🏐</Text>
            </View>
            <Text style={styles.sportName}>Bóng chuyền</Text>
          </View>
        </ScrollView>

        {/* Section title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            🌍 Bạn muốn tìm kiếm nhiều hơn
          </Text>
          <TouchableOpacity>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Venue Card 1 - PT SPORT */}
        <View style={styles.venueCard}>
          <View style={styles.venueCardHeader}>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>5.0</Text>
            </View>
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.tagText}>Đơn ngày</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: "#E91E63" }]}>
                <Text style={styles.tagText}>Sự kiện</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity>
                <Text style={styles.actionIcon}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.actionIcon}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.venueCardContent}>
            <View style={styles.venueInfo}>
              <View style={styles.venueLogoContainer}>
                <View style={styles.venueLogo}>
                  <Text style={styles.venueLogoText}>🏸</Text>
                </View>
              </View>
              <View style={styles.venueDetails}>
                <Text style={styles.venueName}>
                  CLB Cầu Lông TPT Sport - Lăng đại học
                </Text>
                <Text style={styles.venueAddress}>
                  Thôn D, Tân Thới Tung, Đông Hòa, Dĩ An, Bình Dương
                </Text>
                <View style={styles.venueMetaContainer}>
                  <Text style={styles.venueMeta}>🕐 06:00 - 22:00</Text>
                  <Text style={styles.venueMeta}>📞 0974857048</Text>
                </View>
              </View>
            </View>
            <View style={styles.qrContainer}>
              <View style={styles.qrCode}>
                <View style={styles.qrPattern}>
                  <View style={styles.qrDot} />
                  <View style={styles.qrDot} />
                  <View style={styles.qrDot} />
                  <View style={styles.qrDot} />
                </View>
                <Text style={styles.qrText}>QR CODE</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>ĐẶT LỊCH</Text>
          </TouchableOpacity>
        </View>

        {/* Venue Card 2 - Sân Hoa Thiên Lý */}
        <View style={styles.venueCard}>
          <View style={styles.venueCardHeader}>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>4.5</Text>
            </View>
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.tagText}>Đơn ngày</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: "#2196F3" }]}>
                <Text style={styles.tagText}>Đơn tháng</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: "#E91E63" }]}>
                <Text style={styles.tagText}>Sự kiện</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity>
                <Text style={styles.actionIcon}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.actionIcon}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.venueCardContent}>
            <View style={styles.venueInfo}>
              <View style={styles.venueLogoContainer}>
                <View
                  style={[styles.venueLogo, { backgroundColor: "#FF9800" }]}
                >
                  <Text style={styles.venueLogoText}>🏟️</Text>
                </View>
              </View>
              <View style={styles.venueDetails}>
                <Text style={styles.venueName}>Sân Hoa Thiên Lý</Text>
                <Text style={styles.venueAddress}>Số 4 Nguyễn Văn Cừ</Text>
                <View style={styles.venueMetaContainer}>
                  <Text style={styles.venueMeta}>🕐 05:00 - 24:00</Text>
                  <Text style={styles.venueMeta}>📞 0913223333</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>ĐẶT LỊCH</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIconActive}>🏠</Text>
            <Text style={styles.navTextActive}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🗺️</Text>
            <Text style={styles.navText}>Bản đồ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navText}>Nội bật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 50,
  },
  headerMain: {
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 1,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 20,
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  authButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  registerBtn: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerBtnText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
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
  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heartIcon: {
    fontSize: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  sportsContainer: {
    marginBottom: 20,
  },
  sportItem: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  sportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  sportEmoji: {
    fontSize: 24,
  },
  sportName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  filterIcon: {
    fontSize: 20,
  },
  venueCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  venueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    fontSize: 14,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  venueCardContent: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 0,
  },
  venueInfo: {
    flex: 1,
    flexDirection: "row",
  },
  venueLogoContainer: {
    marginRight: 12,
  },
  venueLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  venueLogoText: {
    fontSize: 20,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  venueMetaContainer: {
    gap: 4,
  },
  venueMeta: {
    fontSize: 12,
    color: "#666",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  qrCode: {
    width: 60,
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  qrPattern: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 20,
    height: 20,
    marginBottom: 4,
  },
  qrDot: {
    width: 8,
    height: 8,
    backgroundColor: "#333",
    margin: 1,
  },
  qrText: {
    fontSize: 8,
    color: "#666",
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#FFC107",
    margin: 12,
    marginTop: 0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNavigation: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  navTextActive: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  navText: {
    fontSize: 12,
    color: "#666",
  },
});

export default SportsBookingApp;
