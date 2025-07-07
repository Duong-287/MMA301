import { useState } from "react";
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
import Feather from "react-native-vector-icons/Feather";
import BottomNavigation from "../../components/BottomNavigation";
import { login, register, forgotPassword } from "../../services/auth";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useAuth();
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName || !formData.phone) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin đăng ký!");
        return false;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        Alert.alert("Lỗi", "Số điện thoại không hợp lệ!");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        const user = result.user;
        setUser(user);
        if (user.role === "admin") {
          navigation.navigate("AdminDashboard");
        } else if (user.role === "customer") {
          navigation.navigate("Home");
        } else {
          Alert.alert("Lỗi", "Vai trò người dùng không hợp lệ!");
          return;
        }
      } else {
        const resultRegister = await register(
          formData.fullName,
          formData.email,
          formData.password,
          formData.phone
        );
        if (!resultRegister) {
          Alert.alert("Lỗi", "Đăng ký thất bại!");
          return;
        } else {
          navigation.navigate("Login");
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
          return;
        }
        Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.", [
          {
            text: "OK",
            onPress: () => {
              setIsLogin(true);
              setFormData({
                email: formData.email,
                password: "",
                confirmPassword: "",
                fullName: "",
                phone: "",
              });
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      "Thông báo",
      `Đăng nhập bằng ${provider} đang được phát triển!`
    );
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert("Thông báo", "Vui lòng nhập email để khôi phục mật khẩu!");
      return;
    }

    Alert.alert(
      "Khôi phục mật khẩu",
      `Chúng tôi sẽ gửi link khôi phục mật khẩu đến email: ${formData.email}`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Gửi",
          onPress: async () => {
            try {
              const resForgotPass = await forgotPassword(formData.email);
              if (!resForgotPass) {
                Alert.alert(
                  "Lỗi",
                  "Không thể gửi email khôi phục. Vui lòng thử lại."
                );
                return;
              }
              Alert.alert("Thành công", "Đã gửi email khôi phục mật khẩu.");
              navigation.navigate("VerifyOtpScreen", { email: formData.email });
            } catch (error) {
              Alert.alert("Lỗi", error.message || "Đã có lỗi xảy ra");
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🏸</Text>
        </View>
        <Text style={styles.appName}>BadmintonPro</Text>
        <Text style={styles.appSlogan}>Đặt sân cầu lông dễ dàng</Text>
      </View>
    </View>
  );

  const renderToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, isLogin && styles.activeToggle]}
        onPress={() => setIsLogin(true)}
      >
        <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
          Đăng nhập
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, !isLogin && styles.activeToggle]}
        onPress={() => setIsLogin(false)}
      >
        <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
          Đăng ký
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
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

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkedBox]}>
            {rememberMe && <Feather name="check" size={12} color="#fff" />}
          </View>
          <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="phone" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
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

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
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
    </View>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity
      style={[styles.submitButton, isLoading && styles.disabledButton]}
      onPress={handleSubmit}
      disabled={isLoading}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={styles.submitButtonText}>Đang xử lý...</Text>
        </View>
      ) : (
        <Text style={styles.submitButtonText}>
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderSocialLogin = () => (
    <View style={styles.socialContainer}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Hoặc</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialLogin("Google")}
        >
          <Text style={styles.socialButtonText}>G</Text>
          <Text style={styles.socialButtonLabel}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <Text style={styles.socialButtonText}>f</Text>
          <Text style={styles.socialButtonLabel}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
        <Text style={styles.footerLink} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
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
          {renderToggle()}
          {isLogin ? renderLoginForm() : renderRegisterForm()}
          {renderSubmitButton()}
          {isLogin && renderSocialLogin()}
          {renderFooter()}
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation activeTab="Tài khoản" />
    </SafeAreaView>
  );
}

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
    marginBottom: 40,
    marginTop: 20,
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: "#10B981",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeToggleText: {
    color: "#fff",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  rememberText: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
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
  socialContainer: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6B7280",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  googleButton: {
    borderColor: "#EA4335",
  },
  facebookButton: {
    borderColor: "#1877F2",
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  socialButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
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
