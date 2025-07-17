import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { addMoneyToWallet, getCustomerWallet } from "../../services/wallet";
import { getTransactions } from "../../services/transaction";

const WalletScreen = ({ navigation, route }) => {
  const { customerId } = route?.params || { customerId: "customer123" };
  const [transaction, setTransaction] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("momo");

  useEffect(() => {
    loadWalletData();
  }, [customerId]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      if (res?.wallet && res?.data) {
        setTransaction(res.data);
      } else {
        console.warn("Invalid response format", res);
        setTransaction([]);
      }
    } catch (err) {
      console.log("Error fetching transactions:", err);
      setTransaction([]);
    }
  };

  const loadWalletData = async () => {
    try {
      setLoading(true);

      const res = await getCustomerWallet();

      if (res.success) {
        setWalletData({
          balance: res.data.balance || 0,
          transactions: res.data.transactions || [],
        });
      } else {
        Alert.alert("Lỗi", res.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const handleDeposit = async () => {
    if (!depositAmount.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền muốn nạp");
      return;
    }

    const amount = Number.parseInt(depositAmount.replace(/[^0-9]/g, ""));
    if (amount < 10000) {
      Alert.alert("Lỗi", "Số tiền nạp tối thiểu là 10,000 VNĐ");
      return;
    }

    try {
      const result = await addMoneyToWallet(amount);
      if (result.success) {
        Alert.alert(
          "Thành công",
          `Đã nạp ${formatCurrency(amount)} VNĐ vào ví thành công!`
        );
        setShowDepositModal(false);
        setDepositAmount("");
        await loadWalletData();
        await loadTransactions();
      } else {
        Alert.alert("Lỗi", result.message || "Nạp tiền thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const formatCurrency = (amount) => {
    return Math.abs(amount)?.toLocaleString() || "0";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return "📥";
      case "booking_payment":
        return "🏸";
      case "refund":
        return "↩️";
      default:
        return "💳";
    }
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? "#4CAF50" : "#F44336";
  };

  const paymentMethods = [
    { key: "momo", label: "Ví MoMo", icon: "📱" },
    { key: "zalopay", label: "ZaloPay", icon: "💳" },
    { key: "bank_transfer", label: "Chuyển khoản", icon: "🏦" },
    { key: "vnpay", label: "VNPay", icon: "💰" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Đang tải thông tin ví...</Text>
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
        <Text style={styles.headerTitle}>Ví tiền</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(walletData.balance)} VNĐ
          </Text>
          <TouchableOpacity
            style={styles.depositButton}
            onPress={() => setShowDepositModal(true)}
          >
            <Text style={styles.depositButtonText}>📥 Nạp tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Thống kê</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionText}>Khuyến mãi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>❓</Text>
            <Text style={styles.actionText}>Hỗ trợ</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>

          {transaction.length > 0 ? (
            transaction.map((item) => (
              <View key={item._id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionIcon}>
                    {getTransactionIcon(item.type)}
                  </Text>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>
                      {item.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                    {item.paymentMethod && (
                      <Text style={styles.transactionMethod}>
                        {
                          paymentMethods.find(
                            (m) => m.key === item.paymentMethod
                          )?.label
                        }
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(item.amount) },
                    ]}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {formatCurrency(item.amount)} VNĐ
                  </Text>
                  <Text style={styles.transactionStatus}>{item.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsIcon}>💳</Text>
              <Text style={styles.emptyTransactionsText}>
                Chưa có giao dịch nào
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Deposit Modal */}
      <Modal visible={showDepositModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nạp tiền vào ví</Text>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số tiền muốn nạp</Text>
                <TextInput
                  style={styles.textInput}
                  value={
                    depositAmount
                      ? formatCurrency(depositAmount.replace(/[^0-9]/g, ""))
                      : ""
                  }
                  onChangeText={(text) =>
                    setDepositAmount(text.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Nhập số tiền (tối thiểu 10,000 VNĐ)"
                  keyboardType="numeric"
                />
              </View>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmounts}>
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setDepositAmount(amount.toString())}
                  >
                    <Text style={styles.quickAmountText}>
                      {formatCurrency(amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phương thức thanh toán</Text>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.key}
                    style={[
                      styles.paymentMethod,
                      selectedPaymentMethod === method.key &&
                        styles.paymentMethodSelected,
                    ]}
                    onPress={() => setSelectedPaymentMethod(method.key)}
                  >
                    <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                    <Text style={styles.paymentMethodText}>{method.label}</Text>
                    <View
                      style={[
                        styles.radioButton,
                        selectedPaymentMethod === method.key &&
                          styles.radioButtonSelected,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeposit}
              >
                <Text style={styles.confirmButtonText}>Xác nhận nạp tiền</Text>
              </TouchableOpacity>
            </ScrollView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  depositButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  depositButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  actionItem: {
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  transactionSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  transactionItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 1,
  },
  transactionMethod: {
    fontSize: 10,
    color: "#999",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    color: "#666",
  },
  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTransactionsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTransactionsText: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickAmountText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  paymentMethodSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#e8f5e8",
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  radioButtonSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#2E7D32",
  },
  confirmButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WalletScreen;
