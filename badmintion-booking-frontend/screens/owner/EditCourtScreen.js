import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createCourt, getCourtById, updateCourt } from "../../services/court";
import { uploadMultipleImages } from "../../services/upload";
import { useAuth } from "../../context/AuthContext";

const EditCourtScreen = ({ route, navigation }) => {
  const { courtId, isNewCourt = false } = route?.params || {};
  const { user } = useAuth();
  const ownerId = user?.id;

  const [courtData, setCourtData] = useState({
    name: "",
    address: "",
    startTime: "07:00",
    endTime: "21:00",
    pricePerHour: "",
    serviceFee: "",
    status: "active",
    description: "",
    images: [],
    facilities: [],
    rules: [],
    policies: [],
    latitude: 10.762622,
    longitude: 106.660172,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!isNewCourt);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: "",
    icon: "star",
    available: true,
  });
  const [newRule, setNewRule] = useState("");
  const [newPolicy, setNewPolicy] = useState("");

  const predefinedFacilities = [
    { name: "Sân cầu lông tiêu chuẩn", icon: "activity", available: true },
    { name: "Sân pickleball ngoài trời", icon: "target", available: true },
    { name: "Điều hòa nhiệt độ", icon: "thermometer", available: true },
    { name: "Hệ thống âm thanh", icon: "volume-2", available: true },
    { name: "Đèn LED chuyên dụng", icon: "sun", available: true },
    { name: "Phòng thay đồ", icon: "home", available: true },
    { name: "Khu vực nghỉ ngơi", icon: "coffee", available: true },
    { name: "Bãi đậu xe", icon: "car", available: true },
    { name: "Wifi miễn phí", icon: "wifi", available: true },
    { name: "Nước uống miễn phí", icon: "droplet", available: true },
  ];

  const facilityIcons = [
    "activity",
    "target",
    "thermometer",
    "volume-2",
    "sun",
    "home",
    "coffee",
    "car",
    "wifi",
    "droplet",
    "star",
    "heart",
    "shield",
  ];

  useEffect(() => {
    if (!isNewCourt && courtId) {
      loadCourtData();
    }
  }, [courtId, isNewCourt]);

  const loadCourtData = async () => {
    try {
      setInitialLoading(true);
      const response = await getCourtById(courtId);

      if (response.success) {
        const court = response.data.court;
        setCourtData({
          name: court.name || "",
          ownerId: court.ownerId?._id,
          address: court.address || "",
          startTime: court.startTime || "07:00",
          endTime: court.endTime || "21:00",
          pricePerHour: court.pricePerHour?.toString() || "",
          serviceFee: court.serviceFee?.toString() || "",
          status: court.status || "active",
          description: court.description || "",
          images: court.images || [],
          facilities: court.facilities || [],
          rules: court.rules || [],
          policies: court.policies || [],
          latitude: court.latitude || null,
          longitude: court.longitude || null,
        });
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      navigation.goBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCourtData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh");
      return;
    }

    Alert.alert("Chọn ảnh", "Bạn muốn chọn ảnh từ đâu?", [
      { text: "Hủy", style: "cancel" },
      { text: "Thư viện", onPress: () => openImageLibrary() },
      { text: "Chụp ảnh", onPress: () => openCamera() },
    ]);
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      await uploadImages(result.assets);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImages(result.assets);
    }
  };

  const uploadImages = async (assets) => {
    try {
      setUploadingImages(true);

      const imageUris = assets.map((asset) => asset.uri);
      const uploadedUrls = await uploadMultipleImages(imageUris, "courts");

      setCourtData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      Alert.alert("Thành công", "Đã upload ảnh thành công!");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (imageUrl, index) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa ảnh này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            // Xóa ảnh khỏi server (nếu cần)
            // await uploadAPI.deleteImage(imageUrl)

            // Xóa ảnh khỏi state
            setCourtData((prev) => ({
              ...prev,
              images: prev.images.filter((_, i) => i !== index),
            }));
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa ảnh");
          }
        },
      },
    ]);
  };

  const addPredefinedFacility = (facility) => {
    const exists = courtData.facilities.some((f) => f.name === facility.name);
    if (!exists) {
      setCourtData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, { ...facility }],
      }));
    }
  };

  const addCustomFacility = () => {
    if (newFacility.name.trim()) {
      const exists = courtData.facilities.some(
        (f) => f.name === newFacility.name.trim()
      );
      if (!exists) {
        setCourtData((prev) => ({
          ...prev,
          facilities: [
            ...prev.facilities,
            { ...newFacility, name: newFacility.name.trim() },
          ],
        }));
        setNewFacility({ name: "", icon: "star", available: true });
        setShowFacilityModal(false);
      } else {
        Alert.alert("Lỗi", "Tiện nghi này đã tồn tại");
      }
    }
  };

  const removeFacility = (index) => {
    setCourtData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const toggleFacilityAvailability = (index) => {
    setCourtData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) =>
        i === index ? { ...facility, available: !facility.available } : facility
      ),
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setCourtData((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule("");
      setShowRuleModal(false);
    }
  };

  const removeRule = (index) => {
    setCourtData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const addPolicy = () => {
    if (newPolicy.trim()) {
      setCourtData((prev) => ({
        ...prev,
        policies: [...prev.policies, newPolicy.trim()],
      }));
      setNewPolicy("");
      setShowPolicyModal(false);
    }
  };

  const removePolicy = (index) => {
    setCourtData((prev) => ({
      ...prev,
      policies: prev.policies.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!courtData.name.trim()) {
      newErrors.name = "Tên sân không được để trống";
    }

    if (!courtData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!courtData.description.trim()) {
      newErrors.description = "Giới thiệu sân không được để trống";
    }

    if (!courtData.pricePerHour.trim()) {
      newErrors.pricePerHour = "Giá thuê không được để trống";
    } else if (
      isNaN(courtData.pricePerHour) ||
      Number.parseInt(courtData.pricePerHour) <= 0
    ) {
      newErrors.pricePerHour = "Giá thuê phải là số dương";
    }

    // if (courtData.images.length === 0) {
    //   newErrors.images = "Vui lòng thêm ít nhất 1 ảnh";
    // }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(courtData.startTime)) {
      newErrors.startTime = "Định dạng giờ không hợp lệ (HH:MM)";
    }

    if (!timeRegex.test(courtData.endTime)) {
      newErrors.endTime = "Định dạng giờ không hợp lệ (HH:MM)";
    }

    if (courtData.startTime >= courtData.endTime) {
      newErrors.endTime = "Giờ đóng cửa phải sau giờ mở cửa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      "Xác nhận",
      isNewCourt
        ? "Bạn có chắc chắn muốn tạo sân mới?"
        : "Bạn có chắc chắn muốn lưu thay đổi?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: isNewCourt ? "Tạo" : "Lưu",
          onPress: () => saveCourt(),
        },
      ]
    );
  };

  const saveCourt = async () => {
    try {
      setLoading(true);

      const dataToSend = {
        name: courtData.name.trim(),
        ownerId: ownerId,
        address: courtData.address.trim(),
        description: courtData.description.trim(),
        startTime: courtData.startTime,
        endTime: courtData.endTime,
        pricePerHour: Number.parseInt(courtData.pricePerHour),
        serviceFee: Number.parseInt(courtData.serviceFee) || 0,
        status: courtData.status,
        images: courtData.images,
        facilities: courtData.facilities,
        rules: courtData.rules,
        policies: courtData.policies,
        latitude: courtData.latitude,
        longitude: courtData.longitude,
      };

      let response;
      if (isNewCourt) {
        response = await createCourt(dataToSend);
      } else {
        response = await updateCourt(courtId, dataToSend);
      }

      if (response.success) {
        Alert.alert(
          "Thành công",
          isNewCourt
            ? "Đã tạo sân mới thành công!"
            : "Đã cập nhật thông tin sân!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (field, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    handleInputChange(field, numericValue);
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

  if (initialLoading) {
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
        <Text style={styles.headerTitle}>
          {isNewCourt ? "Tạo sân mới" : "Chỉnh sửa sân"}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isNewCourt ? "Tạo" : "Lưu"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên sân *</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={courtData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Nhập tên sân"
              placeholderTextColor="#999"
              editable={!loading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ *</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                errors.address && styles.inputError,
              ]}
              value={courtData.address}
              onChangeText={(text) => handleInputChange("address", text)}
              placeholder="Nhập địa chỉ đầy đủ"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              editable={!loading}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giới thiệu sân *</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={courtData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Mô tả về sân, vị trí, đặc điểm nổi bật..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              editable={!loading}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hình ảnh sân *</Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                uploadingImages && styles.addButtonDisabled,
              ]}
              onPress={pickImage}
              disabled={uploadingImages}
            >
              {uploadingImages ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.addButtonText}>+ Thêm ảnh</Text>
              )}
            </TouchableOpacity>
          </View>

          {courtData.images.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesList}
            >
              {courtData.images.map((imageUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `http://192.168.1.18:3000/uploads/${imageUrl}`,
                    }}
                    style={styles.courtImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(imageUrl, index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.emptyImageContainer}
              onPress={pickImage}
            >
              <Text style={styles.emptyImageIcon}>📷</Text>
              <Text style={styles.emptyImageText}>Nhấn để thêm ảnh sân</Text>
            </TouchableOpacity>
          )}
          {errors.images && (
            <Text style={styles.errorText}>{errors.images}</Text>
          )}
        </View>

        {/* Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tiện nghi</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowFacilityModal(true)}
            >
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Predefined Facilities */}
          <Text style={styles.subSectionTitle}>Tiện nghi có sẵn:</Text>
          <View style={styles.facilitiesGrid}>
            {predefinedFacilities.map((facility, index) => {
              const isAdded = courtData.facilities.some(
                (f) => f.name === facility.name
              );
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.facilityItem,
                    isAdded && styles.facilityItemSelected,
                  ]}
                  onPress={() => !isAdded && addPredefinedFacility(facility)}
                  disabled={isAdded}
                >
                  <Text style={styles.facilityIcon}>
                    {getIconDisplay(facility.icon)}
                  </Text>
                  <Text
                    style={[
                      styles.facilityText,
                      isAdded && styles.facilityTextSelected,
                    ]}
                  >
                    {facility.name}
                  </Text>
                  {isAdded && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Added Facilities */}
          {courtData.facilities.length > 0 && (
            <>
              <Text style={styles.subSectionTitle}>Tiện nghi đã thêm:</Text>
              {courtData.facilities.map((facility, index) => (
                <View key={index} style={styles.addedFacilityItem}>
                  <View style={styles.facilityInfo}>
                    <Text style={styles.facilityIcon}>
                      {getIconDisplay(facility.icon)}
                    </Text>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <TouchableOpacity
                      style={styles.availabilityToggle}
                      onPress={() => toggleFacilityAvailability(index)}
                    >
                      <Text
                        style={[
                          styles.availabilityText,
                          facility.available
                            ? styles.availableText
                            : styles.unavailableText,
                        ]}
                      >
                        {facility.available ? "Có sẵn" : "Không có"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeFacility(index)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Operating Hours & Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giờ hoạt động & Giá cả</Text>

          <View style={styles.timeContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={styles.inputLabel}>Giờ mở cửa *</Text>
              <TextInput
                style={[
                  styles.timeInput,
                  errors.startTime && styles.inputError,
                ]}
                value={courtData.startTime}
                onChangeText={(text) => handleInputChange("startTime", text)}
                placeholder="07:00"
                placeholderTextColor="#999"
                editable={!loading}
              />
              {errors.startTime && (
                <Text style={styles.errorText}>{errors.startTime}</Text>
              )}
            </View>

            <Text style={styles.timeSeparator}>-</Text>

            <View style={styles.timeInputGroup}>
              <Text style={styles.inputLabel}>Giờ đóng cửa *</Text>
              <TextInput
                style={[styles.timeInput, errors.endTime && styles.inputError]}
                value={courtData.endTime}
                onChangeText={(text) => handleInputChange("endTime", text)}
                placeholder="21:00"
                placeholderTextColor="#999"
                editable={!loading}
              />
              {errors.endTime && (
                <Text style={styles.errorText}>{errors.endTime}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giá thuê/giờ (VNĐ) *</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  errors.pricePerHour && styles.inputError,
                ]}
                value={
                  courtData.pricePerHour
                    ? formatCurrency(courtData.pricePerHour)
                    : ""
                }
                onChangeText={(text) => handlePriceChange("pricePerHour", text)}
                placeholder="150,000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!loading}
              />
              <Text style={styles.currencyLabel}>VNĐ</Text>
            </View>
            {errors.pricePerHour && (
              <Text style={styles.errorText}>{errors.pricePerHour}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phí dịch vụ (VNĐ)</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.textInput}
                value={
                  courtData.serviceFee
                    ? formatCurrency(courtData.serviceFee)
                    : ""
                }
                onChangeText={(text) => handlePriceChange("serviceFee", text)}
                placeholder="15,000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!loading}
              />
              <Text style={styles.currencyLabel}>VNĐ</Text>
            </View>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quy định sân</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowRuleModal(true)}
            >
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {courtData.rules.length > 0 ? (
            courtData.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleText}>• {rule}</Text>
                <TouchableOpacity onPress={() => removeRule(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Chưa có quy định nào</Text>
          )}
        </View>

        {/* Policies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chính sách ưu đãi</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowPolicyModal(true)}
            >
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {courtData.policies.length > 0 ? (
            courtData.policies.map((policy, index) => (
              <View key={index} style={styles.policyItem}>
                <Text style={styles.policyIcon}>🎁</Text>
                <Text style={styles.policyText}>{policy}</Text>
                <TouchableOpacity onPress={() => removePolicy(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Chưa có ưu đãi nào</Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                courtData.status === "active" && styles.statusOptionActive,
              ]}
              onPress={() => handleInputChange("status", "active")}
              disabled={loading}
            >
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        courtData.status === "active" ? "#4CAF50" : "#E0E0E0",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    courtData.status === "active" && styles.statusTextActive,
                  ]}
                >
                  Hoạt động
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusOption,
                courtData.status === "waiting" && styles.statusOptionActive,
              ]}
              onPress={() => handleInputChange("status", "waiting")}
              disabled={loading}
            >
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        courtData.status === "waiting" ? "#FF9800" : "#E0E0E0",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    courtData.status === "waiting" && styles.statusTextActive,
                  ]}
                >
                  Chờ duyệt
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Facility Modal */}
      <Modal visible={showFacilityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm tiện nghi tùy chỉnh</Text>
              <TouchableOpacity onPress={() => setShowFacilityModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên tiện nghi</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newFacility.name}
                  onChangeText={(text) =>
                    setNewFacility((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Nhập tên tiện nghi"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {facilityIcons.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        newFacility.icon === icon && styles.iconOptionSelected,
                      ]}
                      onPress={() =>
                        setNewFacility((prev) => ({ ...prev, icon }))
                      }
                    >
                      <Text style={styles.iconText}>
                        {getIconDisplay(icon)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={addCustomFacility}
              >
                <Text style={styles.modalButtonText}>Thêm tiện nghi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rule Modal */}
      <Modal visible={showRuleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm quy định</Text>
              <TouchableOpacity onPress={() => setShowRuleModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={newRule}
                onChangeText={setNewRule}
                placeholder="Nhập quy định sân"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.modalButton} onPress={addRule}>
                <Text style={styles.modalButtonText}>Thêm quy định</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Policy Modal */}
      <Modal visible={showPolicyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm chính sách ưu đãi</Text>
              <TouchableOpacity onPress={() => setShowPolicyModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={newPolicy}
                onChangeText={setNewPolicy}
                placeholder="Nhập chính sách ưu đãi"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.modalButton} onPress={addPolicy}>
                <Text style={styles.modalButtonText}>Thêm ưu đãi</Text>
              </TouchableOpacity>
            </View>
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
  saveButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
  },
  imagesList: {
    marginTop: 8,
  },
  imageContainer: {
    marginRight: 12,
    position: "relative",
  },
  courtImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#F44336",
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyImageContainer: {
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  emptyImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyImageText: {
    fontSize: 14,
    color: "#666",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  facilityItemSelected: {
    backgroundColor: "#E8F5E8",
    borderColor: "#2E7D32",
  },
  facilityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  facilityText: {
    fontSize: 12,
    color: "#666",
    marginRight: 6,
  },
  facilityTextSelected: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  checkIcon: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  addedFacilityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  facilityInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  facilityName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  availabilityToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  availableText: {
    color: "#4CAF50",
  },
  unavailableText: {
    color: "#F44336",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginHorizontal: 16,
    marginTop: 32,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  currencyLabel: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  policyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  removeText: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "bold",
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  statusContainer: {
    gap: 12,
  },
  statusOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#f9f9f9",
  },
  statusOptionActive: {
    borderColor: "#2E7D32",
    backgroundColor: "#E8F5E8",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  statusTextActive: {
    color: "#2E7D32",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    padding: 16,
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#E8F5E8",
  },
  iconText: {
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditCourtScreen;