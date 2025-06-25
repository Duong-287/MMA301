import React, { useState } from "react";
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
} from "react-native";

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = () => {
    console.log("Login data:", formData);
  };

  const handleRegister = () => {
    console.log("Navigate to Register");
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
          <View style={styles.centerContainer}>
            {/* Form Card */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Chào mừng bạn quay lại với ALOBO!
              </Text>

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
