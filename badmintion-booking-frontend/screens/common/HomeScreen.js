import React from "react";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
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
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../../components/BottomNavigation";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  if (user) {
    console.log("Đã đăng nhập:", user);
  } else {
    console.log("Chưa đăng nhập");
  }

  useEffect(() => {
    moment.locale("vi");
    const now = moment();
    const formatted = now.format("dddd, DD/MM/YYYY");
    setCurrentDate(formatted);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      {/* Enhanced Header với gradient effect */}
      <View style={styles.header}>
        {/* Enhanced Background pattern */}
        <View style={styles.backgroundPattern}>
          <View
            style={[
              styles.circle,
              { top: -30, right: 40, width: 100, height: 100, opacity: 0.15 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 10, right: -20, width: 80, height: 80, opacity: 0.12 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 50, right: 70, width: 60, height: 60, opacity: 0.1 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 5, right: 110, width: 40, height: 40, opacity: 0.08 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { top: 80, right: 20, width: 35, height: 35, opacity: 0.1 },
            ]}
          />
        </View>

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Main header content */}
        <View style={styles.headerMain}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🌿</Text>
              <View style={styles.logoGlow} />
            </View>
            <View>
              <Text style={styles.appName}>ALOBO</Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>

          {user ? (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Xin chào, {user.name} 👋
              </Text>
            </View>
          ) : (
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.loginBtnText}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.registerBtn}>
                <Text style={styles.registerBtnText}>Đăng ký</Text>
                <View style={styles.buttonShine} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Search section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sân thể thao..."
              placeholderTextColor="#999"
            />
            <View style={styles.searchGlow} />
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Text style={styles.heartIcon}>❤️</Text>
            <View style={styles.heartGlow} />
          </TouchableOpacity>
        </View>

        {/* Enhanced Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[styles.filterChip, styles.filterChipActive]}
          >
            <Text style={styles.filterTextActive}>🚗 Xe về gần tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>🏓 Pickleball gần tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>🏸 Cầu lông gần tôi</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Enhanced Sports categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sportsContainer}
        >
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#2196F3" }]}>
              <Text style={styles.sportEmoji}>🏓</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>Pickleball</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.sportEmoji}>🏸</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>Cầu lông</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#FF5722" }]}>
              <Text style={styles.sportEmoji}>⚽</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>Bóng đá</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#FF9800" }]}>
              <Text style={styles.sportEmoji}>🎾</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>Tennis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#9C27B0" }]}>
              <Text style={styles.sportEmoji}>🏐</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>B.Chuyền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportItem}>
            <View style={[styles.sportIcon, { backgroundColor: "#E91E63" }]}>
              <Text style={styles.sportEmoji}>🏐</Text>
              <View style={styles.sportIconGlow} />
            </View>
            <Text style={styles.sportName}>Bóng chuyền</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Enhanced Section title */}
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionIcon}>🌟</Text>
            <Text style={styles.sectionTitle}>Khám phá thêm</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Venue Cards */}
        <TouchableOpacity style={styles.venueCard}>
          <View style={styles.venueCardGlow} />
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
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.venueCardContent}>
            <View style={styles.venueInfo}>
              <View style={styles.venueLogoContainer}>
                <View style={styles.venueLogo}>
                  <Text style={styles.venueLogoText}>🏸</Text>
                  <View style={styles.venueLogoGlow} />
                </View>
              </View>
              <View style={styles.venueDetails}>
                <Text style={styles.venueName}>
                  CLB Cầu Lông TPT Sport - Lăng đại học
                </Text>
                <Text style={styles.venueAddress}>
                  📍 Thôn D, Tân Thới Tung, Đông Hòa, Dĩ An, Bình Dương
                </Text>
                <View style={styles.venueMetaContainer}>
                  <View style={styles.venueMetaItem}>
                    <Text style={styles.venueMetaIcon}>🕐</Text>
                    <Text style={styles.venueMeta}>06:00 - 22:00</Text>
                  </View>
                  <View style={styles.venueMetaItem}>
                    <Text style={styles.venueMetaIcon}>📞</Text>
                    <Text style={styles.venueMeta}>0974857048</Text>
                  </View>
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
            <Text style={styles.bookButtonText}>⚡ ĐẶT LỊCH NGAY</Text>
            <View style={styles.bookButtonGlow} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Enhanced Venue Card 2 */}
        <TouchableOpacity style={styles.venueCard}>
          <View style={styles.venueCardGlow} />
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
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📤</Text>
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
                  <View style={styles.venueLogoGlow} />
                </View>
              </View>
              <View style={styles.venueDetails}>
                <Text style={styles.venueName}>Sân Hoa Thiên Lý</Text>
                <Text style={styles.venueAddress}>📍 Số 4 Nguyễn Văn Cừ</Text>
                <View style={styles.venueMetaContainer}>
                  <View style={styles.venueMetaItem}>
                    <Text style={styles.venueMetaIcon}>🕐</Text>
                    <Text style={styles.venueMeta}>05:00 - 24:00</Text>
                  </View>
                  <View style={styles.venueMetaItem}>
                    <Text style={styles.venueMetaIcon}>📞</Text>
                    <Text style={styles.venueMeta}>0913223333</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>⚡ ĐẶT LỊCH NGAY</Text>
            <View style={styles.bookButtonGlow} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Add some bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Enhanced Bottom Navigation */}
      <BottomNavigation activeTab="Tài khoản" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#1B5E20",
    paddingBottom: 25,
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
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(46,125,50,0.1)",
  },
  headerMain: {
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 1,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  logoIcon: {
    fontSize: 24,
  },
  logoGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: 0,
    left: 0,
  },
  appName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dateText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  authButtonsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  loginBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerBtn: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerBtnText: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: "relative",
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: "rgba(76,175,80,0.1)",
    borderRadius: 32,
    zIndex: -1,
  },
  heartButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: "relative",
  },
  heartIcon: {
    fontSize: 22,
  },
  heartGlow: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(233,30,99,0.1)",
    top: 0,
    left: 0,
  },
  filtersContainer: {
    marginBottom: 25,
  },
  filterChip: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterChipActive: {
    backgroundColor: "#E8F5E8",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  filterText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  sportsContainer: {
    marginBottom: 25,
  },
  sportItem: {
    alignItems: "center",
    marginRight: 25,
    width: 80,
  },
  sportIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
  },
  sportEmoji: {
    fontSize: 28,
  },
  sportIconGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    top: 0,
    left: 0,
  },
  sportName: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    fontWeight: "500",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterIcon: {
    fontSize: 18,
  },
  venueCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  venueCardGlow: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    backgroundColor: "rgba(76,175,80,0.05)",
    borderRadius: 23,
    zIndex: -1,
  },
  venueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  star: {
    fontSize: 16,
  },
  rating: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#F57C00",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tagText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 16,
  },
  venueCardContent: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 0,
  },
  venueInfo: {
    flex: 1,
    flexDirection: "row",
  },
  venueLogoContainer: {
    marginRight: 15,
  },
  venueLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "relative",
  },
  venueLogoText: {
    fontSize: 24,
  },
  venueLogoGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    top: 0,
    left: 0,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 22,
  },
  venueAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  venueMetaContainer: {
    gap: 6,
  },
  venueMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  venueMetaIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  venueMeta: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  qrCode: {
    width: 70,
    height: 70,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  qrPattern: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 24,
    height: 24,
    marginBottom: 6,
  },
  qrDot: {
    width: 10,
    height: 10,
    backgroundColor: "#333",
    margin: 1,
    borderRadius: 2,
  },
  qrText: {
    fontSize: 9,
    color: "#666",
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#FF6B35",
    margin: 16,
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: "relative",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButtonGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: "rgba(255,107,53,0.2)",
    borderRadius: 17,
    zIndex: -1,
  },
  bottomSpacing: {
    height: 20,
  },
  bottomNavigation: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navIndicator: {
    width: 50,
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },
  navContainer: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navActiveGlow: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(76,175,80,0.1)",
    top: -8,
    left: -20,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.6,
  },
  navTextActive: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});

export default HomeScreen;
