import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import BottomNavigation from "../../components/BottomNavigation";
import { getReviewsByCourtId } from "../../services/grounds";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const { width } = Dimensions.get("window");

export default function CourtDetailScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("info");
  const [isFavorite, setIsFavorite] = useState(false);
  const [courtReviews, setCourtReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const route = useRoute();
  const { ground } = route.params;
  const court = ground || {};

  const tabs = [
    { id: "info", label: "Thông tin" },
    { id: "services", label: "Dịch vụ" },
    { id: "images", label: "Hình ảnh" },
    { id: "reviews", label: "Đánh giá" },
  ];
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const reviews = await getReviewsByCourtId(court._id);
        setCourtReviews(reviews);
      } catch (error) {
      } finally {
        setLoadingReviews(false);
      }
    };
    if (activeTab === "reviews" && court?._id) {
      fetchReviews();
    }
  }, [activeTab, court.id]);

  const courtImages = [
    {
      id: 1,
      url: "/placeholder.svg?height=200&width=300",
      title: "Sân cầu lông chính",
      description: "Sân cầu lông tiêu chuẩn với đèn LED chuyên dụng",
    },
    {
      id: 2,
      url: "/placeholder.svg?height=200&width=300",
      title: "Sân pickleball ngoài trời",
      description: "Sân pickleball với không gian thoáng đãng",
    },
    {
      id: 3,
      url: "/placeholder.svg?height=200&width=300",
      title: "Khu vực nghỉ ngơi",
      description: "Không gian thư giãn cho khách hàng",
    },
    {
      id: 4,
      url: "/placeholder.svg?height=200&width=300",
      title: "Phòng thay đồ",
      description: "Phòng thay đồ sạch sẽ, tiện nghi",
    },
    {
      id: 5,
      url: "/placeholder.svg?height=200&width=300",
      title: "Lễ tân",
      description: "Khu vực lễ tân và tư vấn",
    },
    {
      id: 6,
      url: "/placeholder.svg?height=200&width=300",
      title: "Bãi đậu xe",
      description: "Bãi đậu xe rộng rãi, an toàn",
    },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackground}>
        <View style={styles.headerOverlay} />
        <Text style={styles.headerSubtitle}>{court.name}</Text>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Feather
              name="heart"
              size={24}
              color={isFavorite ? "#EF4444" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Đặt lịch</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCourtInfo = () => (
    <View style={styles.courtInfoContainer}>
      {/* Court Details Card */}
      <View style={styles.courtCard}>
        <View style={styles.courtHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>N</Text>
            </View>
            <Text style={styles.courtName}>{court.name}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Feather name="map-pin" size={20} color="#10B981" />
            <Text style={styles.contactText}>{court.address}</Text>
          </View>

          <View style={styles.contactRow}>
            <Feather name="clock" size={20} color="#10B981" />
            <Text style={styles.contactText}>
              {court.startTime || "?"} - {court.endTime || "?"}
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Feather name="phone" size={20} color="#10B981" />
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneNumber}>{court.ownerId?.phone}</Text>
            </View>
          </View>
        </View>
      </View>
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

  const renderPricingTable = (court) => (
    <View style={styles.pricingSection}>
      <Text style={styles.pricingSectionTitle}>BẢNG GIÁ THUÊ SÂN</Text>

      <View style={styles.pricingTable}>
        {/* Header Row */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>
            <Text style={styles.tableCellHeaderText}>Loại phí</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>
            <Text style={styles.tableCellHeaderText}>Giá (VNĐ)</Text>
          </View>
        </View>

        {/* Giá thuê theo giờ */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.tableCellText}>Giá thuê / giờ</Text>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.tableCellText}>
              {court.pricePerHour.toLocaleString()} đ
            </Text>
          </View>
        </View>

        {/* Phí dịch vụ nếu có */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.tableCellText}>Phí dịch vụ</Text>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text style={styles.tableCellText}>
              {court.serviceFee.toLocaleString()} đ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.servicesContainer}>
      <Text style={styles.servicesTitle}>BẢNG GIÁ SÂN</Text>
      {renderPricingTable(court)}
    </View>
  );

  const renderInfo = () => (
    <View style={styles.infoContainer}>
      {/* Mô tả */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Giới thiệu</Text>
        <Text style={styles.infoDescription}>{ground.description}</Text>
      </View>

      {/* Tiện nghi */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Tiện nghi</Text>
        <View style={styles.facilitiesGrid}>
          {ground.facilities.map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <Feather name={facility.icon} size={20} color="#10B981" />
              <Text style={styles.facilityText}>{facility.name}</Text>
              {facility.available && (
                <Feather name="check" size={16} color="#10B981" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Quy định */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Quy định sân</Text>
        {ground.rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>

      {/* Chính sách */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Chính sách ưu đãi</Text>
        {ground.policies.map((policy, index) => (
          <View key={index} style={styles.policyItem}>
            <Feather name="gift" size={16} color="#F59E0B" />
            <Text style={styles.policyText}>{policy}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderImages = () => (
    <View style={styles.imagesContainer}>
      <View style={styles.imagesGrid}>
        {courtImages.map((image) => (
          <TouchableOpacity key={image.id} style={styles.imageItem}>
            <View style={styles.imageWrapper}>
              <View style={styles.imagePlaceholder}>
                <Feather name="image" size={40} color="#9CA3AF" />
              </View>
              <View style={styles.imageOverlay}>
                <Feather name="maximize" size={20} color="#fff" />
              </View>
            </View>
            <Text style={styles.imageTitle}>{image.title}</Text>
            <Text style={styles.imageDescription}>{image.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReviews = () => {
    const averageRating =
      courtReviews.length > 0
        ? (
            courtReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            courtReviews.length
          ).toFixed(1)
        : "0.0";

    return (
      <View style={styles.reviewsContainer}>
        {/* Tổng quan đánh giá */}
        <View style={styles.reviewSummary}>
          <View style={styles.ratingOverview}>
            <Text style={styles.overallRating}>{averageRating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Feather key={star} name="star" size={16} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.reviewCount}>
              Dựa trên {courtReviews.length} đánh giá
            </Text>
          </View>

          <TouchableOpacity style={styles.writeReviewButton}>
            <Feather name="edit" size={16} color="#10B981" />
            <Text style={styles.writeReviewText}>Viết đánh giá</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách đánh giá */}
        <View style={styles.reviewsList}>
          {courtReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerAvatarText}>
                      {review.avatar || review.userName?.charAt(0) || "U"}
                    </Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <View style={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Feather
                          key={star}
                          name="star"
                          size={12}
                          color={star <= review.rating ? "#F59E0B" : "#E5E7EB"}
                        />
                      ))}
                      <Text style={styles.reviewDate}> • {review.date}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.reviewComment}>{review.comment}</Text>

              {Array.isArray(review.images) && review.images.length > 0 && (
                <View style={styles.reviewImages}>
                  {review.images.map((image, index) => (
                    <View key={index} style={styles.reviewImageWrapper}>
                      <View style={styles.reviewImagePlaceholder}>
                        <Feather name="image" size={20} color="#9CA3AF" />
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.helpfulButton}>
                  <Feather name="thumbs-up" size={14} color="#6B7280" />
                  <Text style={styles.helpfulText}>
                    Hữu ích ({review.helpful})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.replyButton}>
                  <Feather name="corner-up-left" size={14} color="#6B7280" />
                  <Text style={styles.replyText}>Trả lời</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return renderInfo();
      case "services":
        return renderServices();
      case "images":
        return renderImages();
      case "reviews":
        return renderReviews();
      default:
        return renderServices();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderCourtInfo()}
        {renderTabs()}
        {renderTabContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>
      <BottomNavigation />
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
  headerContainer: {
    height: 200,
    position: "relative",
  },
  headerBackground: {
    flex: 1,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F59E0B",
    letterSpacing: 2,
  },
  navigationBar: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  courtInfoContainer: {
    marginTop: -30,
    paddingHorizontal: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  ratingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  courtCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courtHeader: {
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    color: "#F59E0B",
    fontSize: 24,
    fontWeight: "bold",
  },
  courtName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contactText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  phoneContainer: {
    flexDirection: "row",
    marginLeft: 12,
    flex: 1,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  phoneNote: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    padding: 20,
  },
  tabContentText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
  servicesContainer: {
    padding: 20,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 20,
    textAlign: "center",
  },
  pricingSection: {
    marginBottom: 30,
  },
  pricingSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  pricingTable: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableCellHeader: {
    backgroundColor: "#F9FAFB",
  },
  tableCellHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  tableCellText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  bottomPadding: {
    height: 32,
  },
  infoContainer: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  facilitiesGrid: {
    gap: 12,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  facilityText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  ruleItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  ruleBullet: {
    fontSize: 14,
    color: "#10B981",
    marginRight: 8,
    fontWeight: "bold",
  },
  ruleText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    lineHeight: 20,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: "#92400E",
    marginLeft: 8,
    flex: 1,
  },
  imagesContainer: {
    padding: 20,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageItem: {
    width: (width - 52) / 2,
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  imageDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  reviewsContainer: {
    padding: 20,
  },
  reviewSummary: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingOverview: {
    alignItems: "center",
    marginBottom: 16,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  writeReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    borderRadius: 8,
  },
  writeReviewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: 8,
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewerAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  reviewComment: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImages: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewImageWrapper: {
    marginRight: 8,
  },
  reviewImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpfulText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
});
