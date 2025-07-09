import { useEffect, useState } from "react";
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
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createCourt, getCourtById, updateCourt } from "../../services/court";
import { useAuth } from "../../context/AuthContext";

const EditCourtScreen = ({ route }) => {
  const { user } = useAuth();
  const ownerId = user?.id;
  const { courtId } = route.params || {};
  const isEditMode = !!courtId;
  const navigation = useNavigation();
  const [courtData, setCourtData] = useState({
    name: "",
    ownerId: ownerId,
    address: "",
    startTime: "06:00",
    closeTime: "22:00",
    pricePerHour: "0",
    serviceFee: "0",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const loadCourtData = async () => {
        try {
          const res = await getCourtById(courtId);
          const court = res.data.court;
          setCourtData({
            name: court.name || "",
            ownerId: court.ownerId,
            address: court.address || "",
            startTime: court.startTime || "06:00",
            endTime: court.endTime || "22:00",
            pricePerHour: court.pricePerHour?.toString() || "0",
            serviceFee: court.serviceFee?.toString() || "0",
            status: court.status === "active",
          });
        } catch (error) {
          Alert.alert("Lỗi", "Không thể tải thông tin sân");
          console.log(error);
        }
      };
      loadCourtData();
    }
  }, [courtId]);

  const handleInputChange = (field, value) => {
    setCourtData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!courtData.name.trim()) newErrors.name = "Tên sân không được để trống";
    if (!courtData.address.trim())
      newErrors.address = "Địa chỉ không được để trống";

    if (!courtData.pricePerHour.trim()) {
      newErrors.pricePerHour = "Giá thuê không được để trống";
    } else if (
      isNaN(courtData.pricePerHour) ||
      parseInt(courtData.pricePerHour) <= 0
    ) {
      newErrors.pricePerHour = "Giá thuê phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      ...courtData,
      pricePerHour: parseInt(courtData.pricePerHour),
      serviceFee: parseInt(courtData.serviceFee),
      status: courtData.status ? "active" : "waiting",
    };

    try {
      if (isEditMode) {
        await updateCourt(courtId, payload);
      } else {
        await createCourt({ ...payload, ownerId });
      }

      Alert.alert(
        "Thành công",
        isEditMode ? "Đã cập nhật sân!" : "Đã tạo sân mới!"
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa sân này? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            console.log("Deleting court");
            Alert.alert("Đã xóa", "Sân đã được xóa thành công!");
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Chỉnh sửa sân" : "Thêm sân mới"}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
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
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giờ hoạt động</Text>

          <View style={styles.timeContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={styles.inputLabel}>Giờ mở cửa</Text>
              <TextInput
                style={styles.timeInput}
                value={courtData.startTime}
                onChangeText={(text) => handleInputChange("startTime", text)}
                placeholder="06:00"
                placeholderTextColor="#999"
              />
            </View>

            <Text style={styles.timeSeparator}>-</Text>

            <View style={styles.timeInputGroup}>
              <Text style={styles.inputLabel}>Giờ đóng cửa</Text>
              <TextInput
                style={styles.timeInput}
                value={courtData.endTime}
                onChangeText={(text) => handleInputChange("endTime", text)}
                placeholder="22:00"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá cả</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giá thuê/giờ (VNĐ) *</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.pricePerHour && styles.inputError,
              ]}
              value={courtData.pricePerHour}
              onChangeText={(text) => handleInputChange("pricePerHour", text)}
              placeholder="80000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.pricePerHour && (
              <Text style={styles.errorText}>{errors.pricePerHour}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá dịch vụ</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giá dịch vụ/giờ (VNĐ) *</Text>
            <TextInput
              style={[styles.textInput, errors.serviceFee && styles.inputError]}
              value={courtData.serviceFee}
              onChangeText={(text) => handleInputChange("serviceFee", text)}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.serviceFee && (
              <Text style={styles.errorText}>{errors.serviceFee}</Text>
            )}
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái</Text>

          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Kích hoạt sân</Text>
            <Switch
              value={courtData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              trackColor={{ false: "#e0e0e0", true: "#81C784" }}
              thumbColor={courtData.status ? "#2E7D32" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.statusNote}>
            {courtData.status
              ? "Sân đang hoạt động và có thể nhận đặt lịch"
              : "Sân tạm ngưng hoạt động"}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isEditMode && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>🗑️ Xóa sân</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginHorizontal: 16,
  },
  switchGroup: {
    gap: 16,
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  statusNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  actionButtons: {
    marginTop: 16,
    marginBottom: 32,
    gap: 12,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditCourtScreen;
