"use client";

import { useState } from "react";
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

const EditCourtScreen = () => {
  const [courtData, setCourtData] = useState({
    name: "CLB Cầu Lông TPT Sport - Lăng đại học",
    address: "Thôn D, Tân Thới Tung, Đông Hòa, Dĩ An, Bình Dương",
    phone: "0974857048",
    openTime: "06:00",
    closeTime: "22:00",
    pricePerHour: "80000",
    description: "Sân cầu lông chất lượng cao với đầy đủ tiện nghi",
    isActive: true,
    hasParking: true,
    hasShower: true,
    hasEquipmentRental: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setCourtData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!courtData.name.trim()) {
      newErrors.name = "Tên sân không được để trống";
    }

    if (!courtData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!courtData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(courtData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!courtData.pricePerHour.trim()) {
      newErrors.pricePerHour = "Giá thuê không được để trống";
    } else if (
      isNaN(courtData.pricePerHour) ||
      Number.parseInt(courtData.pricePerHour) <= 0
    ) {
      newErrors.pricePerHour = "Giá thuê phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn lưu thay đổi?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Lưu",
          onPress: () => {
            console.log("Saving court data:", courtData);
            Alert.alert("Thành công", "Đã cập nhật thông tin sân!");
          },
        },
      ]);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa sân</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại *</Text>
            <TextInput
              style={[styles.textInput, errors.phone && styles.inputError]}
              value={courtData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
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
                value={courtData.openTime}
                onChangeText={(text) => handleInputChange("openTime", text)}
                placeholder="06:00"
                placeholderTextColor="#999"
              />
            </View>

            <Text style={styles.timeSeparator}>-</Text>

            <View style={styles.timeInputGroup}>
              <Text style={styles.inputLabel}>Giờ đóng cửa</Text>
              <TextInput
                style={styles.timeInput}
                value={courtData.closeTime}
                onChangeText={(text) => handleInputChange("closeTime", text)}
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

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={courtData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Nhập mô tả về sân..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>

          <View style={styles.switchGroup}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Bãi đỗ xe</Text>
              <Switch
                value={courtData.hasParking}
                onValueChange={(value) =>
                  handleInputChange("hasParking", value)
                }
                trackColor={{ false: "#e0e0e0", true: "#81C784" }}
                thumbColor={courtData.hasParking ? "#2E7D32" : "#f4f3f4"}
              />
            </View>

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Phòng tắm</Text>
              <Switch
                value={courtData.hasShower}
                onValueChange={(value) => handleInputChange("hasShower", value)}
                trackColor={{ false: "#e0e0e0", true: "#81C784" }}
                thumbColor={courtData.hasShower ? "#2E7D32" : "#f4f3f4"}
              />
            </View>

            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Cho thuê dụng cụ</Text>
              <Switch
                value={courtData.hasEquipmentRental}
                onValueChange={(value) =>
                  handleInputChange("hasEquipmentRental", value)
                }
                trackColor={{ false: "#e0e0e0", true: "#81C784" }}
                thumbColor={
                  courtData.hasEquipmentRental ? "#2E7D32" : "#f4f3f4"
                }
              />
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái</Text>

          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Kích hoạt sân</Text>
            <Switch
              value={courtData.isActive}
              onValueChange={(value) => handleInputChange("isActive", value)}
              trackColor={{ false: "#e0e0e0", true: "#81C784" }}
              thumbColor={courtData.isActive ? "#2E7D32" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.statusNote}>
            {courtData.isActive
              ? "Sân đang hoạt động và có thể nhận đặt lịch"
              : "Sân tạm ngưng hoạt động"}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveMainButton} onPress={handleSave}>
            <Text style={styles.saveMainButtonText}>💾 Lưu thay đổi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️ Xóa sân</Text>
          </TouchableOpacity>
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
  saveMainButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  saveMainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
