import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearInput = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleRegister = () => {
    console.log("Registration data:", formData);
  };

  const handleLogin = () => {
    console.log("Navigate to login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section */}
        <View style={styles.headerSection}>
          <Text style={styles.bookNowText}>BOOK NOW</Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>»</Text>
          </View>
        </View>

        {/* Form card */}
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Đăng ký</Text>
          <Text style={styles.subtitle}>
            ALOBO - Đặt lịch online sân thể thao
          </Text>

          {/* Input fields */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Số điện thoại hoặc email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập số điện thoại hoặc email"
              placeholderTextColor="#999"
              value={formData.phoneOrEmail}
              onChangeText={(text) => handleInputChange("phoneOrEmail", text)}
              keyboardType="email-address"
            />
            {formData.phoneOrEmail.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInput("phoneOrEmail")}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Tên đầy đủ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#999"
              value={formData.fullName}
              onChangeText={(text) => handleInputChange("fullName", text)}
            />
            {formData.fullName.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => clearInput("fullName")}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Nhập lại mật khẩu</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>

          {/* Link to Login */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  scrollContent: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  bookNowText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1976D2",
  },
  arrowContainer: {
    marginTop: 8,
    backgroundColor: "#BBDEFB",
    borderRadius: 20,
    padding: 10,
  },
  arrowText: {
    fontSize: 18,
    color: "#1976D2",
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D47A1",
    marginBottom: 4,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#607D8B",
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 16,
    position: "relative",
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
  },
  textInput: {
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#212121",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 38,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "bold",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 38,
  },
  eyeIcon: {
    fontSize: 18,
    color: "#1976D2",
  },
  registerButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: {
    fontSize: 14,
    color: "#757575",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginLeft: 4,
  },
});
