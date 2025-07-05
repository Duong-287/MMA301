"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearInput = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleLogin = () => {
    if (!formData.phoneOrEmail || !formData.password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Mock login logic - thay thế bằng API thực tế
    console.log("Login data:", formData);

    // Giả lập phân quyền dựa trên email/phone
    if (
      formData.phoneOrEmail.includes("owner") ||
      formData.phoneOrEmail.includes("chu")
    ) {
      // Chủ sân
      Alert.alert("Đăng nhập thành công", "Chào mừng chủ sân!", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "OwnerApp" }],
            });
          },
        },
      ]);
    } else if (formData.phoneOrEmail.includes("admin")) {
      // Admin
      Alert.alert("Đăng nhập thành công", "Chào mừng quản trị viên!", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminApp" }],
            });
          },
        },
      ]);
    } else {
      // Khách hàng
      Alert.alert("Đăng nhập thành công", "Chào mừng bạn!", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "CustomerApp" }],
            });
          },
        },
      ]);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng nhập</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.centerContainer}>
            {/* Form Card */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Chào mừng bạn quay lại với ALOBO!
              </Text>

              {/* Demo accounts info */}
              <View style={styles.demoInfo}>
                <Text style={styles.demoTitle}>Tài khoản demo:</Text>
                <Text style={styles.demoText}>
                  • Khách hàng: customer@demo.com
                </Text>
                <Text style={styles.demoText}>• Chủ sân: owner@demo.com</Text>
                <Text style={styles.demoText}>• Admin: admin@demo.com</Text>
                <Text style={styles.demoText}>• Mật khẩu: 123456</Text>
              </View>

              {/* Email/Phone */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Số điện thoại hoặc email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Nhập thông tin đăng nhập"
                  placeholderTextColor="#999"
                  value={formData.phoneOrEmail}
                  onChangeText={(text) =>
                    handleInputChange("phoneOrEmail", text)
                  }
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

              {/* Password */}
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
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
              </TouchableOpacity>

              {/* Link to Register */}
              <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#2E7D32",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  placeholder: {
    width: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D47A1",
    marginBottom: 4,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#607D8B",
    marginBottom: 20,
  },
  demoInfo: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: "#1976D2",
    marginBottom: 2,
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
  loginButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  registerText: {
    fontSize: 14,
    color: "#757575",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginLeft: 4,
  },
});
