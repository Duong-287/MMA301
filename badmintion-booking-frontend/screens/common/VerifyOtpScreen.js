import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPassword } from "../../services/auth";

import Feather from "react-native-vector-icons/Feather";
import { forgotPassword } from "../../services/auth";

const VerifyOtpScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Email được nhận:", route.params?.email);
  }, []);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    } else {
      Alert.alert("Lỗi", "Email không được cung cấp");
      navigation.navigate("Login");
    }
  }, [route.params]);

  const validateForm = () => {
    const otpPattern = /^\d{6}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!otp || !otpPattern.test(otp)) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 số!");
      return false;
    }

    if (!password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu!");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    if (!passwordPattern.test(password)) {
      Alert.alert(
        "Lỗi",
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số!"
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return false;
    }

    return true;
  };

  const handleVerify = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    console.log("GỬI RESET PASSWORD:", {
      email: String(email).trim(),
      otp: String(otp).trim(),
      password,
    });

    try {
      const res = await resetPassword(
        String(email).trim(),
        otp.trim(),
        password
      );

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công!", [
        {
          text: "Đăng nhập ngay",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (err) {
      console.log("LỖI RESET PASSWORD:", err);
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Mã OTP sai hoặc đã hết hạn"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Email không được cung cấp");
      return;
    }
    try {
      await forgotPassword(email);
      Alert.alert("Thành công", "Mã OTP đã được gửi lại!");
    } catch (error) {
      console.log("LỖI GỬI LẠI OTP:", err);
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message ||
          "Không thể gửi lại mã OTP. Vui lòng thử lại."
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🏸</Text>
        </View>
        <Text style={styles.appName}>BadmintonPro</Text>
        <Text style={styles.appSlogan}>Xác minh tài khoản</Text>
      </View>
    </View>
  );

  const renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsTitle}>Xác minh OTP</Text>
      <Text style={styles.instructionsText}>
        Chúng tôi đã gửi mã xác minh 6 số đến email:
      </Text>
      <Text style={styles.emailText}>{email}</Text>
      <Text style={styles.instructionsSubText}>
        Vui lòng nhập mã OTP và mật khẩu mới để hoàn tất việc đặt lại mật khẩu.
      </Text>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* OTP Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="key" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP (6 số)"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <Feather
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Password Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
        <Text style={styles.requirementText}>• Ít nhất 6 ký tự</Text>
        <Text style={styles.requirementText}>
          • Nên bao gồm chữ hoa, chữ thường và số
        </Text>
      </View>
    </View>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity
      style={[styles.submitButton, isLoading && styles.disabledButton]}
      onPress={handleVerify}
      disabled={isLoading}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={styles.submitButtonText}>Đang xử lý...</Text>
        </View>
      ) : (
        <Text style={styles.submitButtonText}>Xác nhận đặt lại mật khẩu</Text>
      )}
    </TouchableOpacity>
  );

  const renderResendSection = () => (
    <View style={styles.resendContainer}>
      <Text style={styles.resendText}>Không nhận được mã OTP?</Text>
      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendLink}>Gửi lại mã</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Đã nhớ mật khẩu?{" "}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate("Login")}
        >
          Đăng nhập ngay
        </Text>
      </Text>

      <Text style={styles.termsText}>
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <Text style={styles.termsLink}>Điều khoản sử dụng</Text> và{" "}
        <Text style={styles.termsLink}>Chính sách bảo mật</Text> của chúng tôi.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}
          {renderInstructions()}
          {renderForm()}
          {renderSubmitButton()}
          {renderResendSection()}
          {renderFooter()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  iconPlaceholder: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  appSlogan: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  instructionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    textAlign: "center",
    marginBottom: 12,
  },
  instructionsSubText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  eyeButton: {
    padding: 8,
  },
  requirementsContainer: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: "#047857",
    marginBottom: 2,
  },
  submitButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderTopColor: "transparent",
    marginRight: 8,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resendText: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 8,
  },
  resendLink: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  footerLink: {
    color: "#10B981",
    fontWeight: "600",
  },
  termsText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: "#10B981",
    fontWeight: "500",
  },
});

export default VerifyOtpScreen;
