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
import { walletAPI } from "../../services/wallet";

const OwnerWalletScreen = ({ navigation, route }) => {
  const { ownerId } = route?.params || {};

  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    revenueStats: {},
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // week, month, year
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  useEffect(() => {
    loadWalletData();
  }, [ownerId, selectedPeriod]);

  const loadWalletData = async () => {
    try {
      setLoading(true);

      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();

      switch (selectedPeriod) {
        case "week":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Load wallet info, transactions, and revenue stats
      const [walletResponse, transactionsResponse, revenueResponse] =
        await Promise.all([
          walletAPI.getWalletInfo(ownerId),
          walletAPI.getTransactionHistory(ownerId, {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
            limit: 20,
          }),
          walletAPI.getRevenueStats(ownerId, startDate, endDate),
        ]);

      setWalletData({
        balance: walletResponse.success ? walletResponse.data.balance : 0,
        transactions: transactionsResponse.success
          ? transactionsResponse.data
          : [],
        revenueStats: revenueResponse.success ? revenueResponse.data : {},
      });
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

  const handleWithdraw = async () => {
    if (!withdrawAmount.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền muốn rút");
      return;
    }

    const amount = Number.parseInt(withdrawAmount.replace(/[^0-9]/g, ""));
    if (amount <= 0) {
      Alert.alert("Lỗi", "Số tiền không hợp lệ");
      return;
    }

    if (amount > walletData.balance) {
      Alert.alert("Lỗi", "Số dư không đủ");
      return;
    }

    if (
      !bankInfo.bankName ||
      !bankInfo.accountNumber ||
      !bankInfo.accountName
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin ngân hàng");
      return;
    }

    try {
      const response = await walletAPI.withdrawMoney(ownerId, amount, bankInfo);

      if (response.success) {
        Alert.alert(
          "Thành công",
          "Yêu cầu rút tiền đã được gửi. Tiền sẽ được chuyển trong 1-2 ngày làm việc."
        );
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        setBankInfo({ bankName: "", accountNumber: "", accountName: "" });
        loadWalletData();
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || "0";
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
      case "booking_payment":
        return "💰";
      case "withdraw":
        return "📤";
      case "deposit":
        return "📥";
      case "refund":
        return "↩️";
      default:
        return "💳";
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "booking_payment":
      case "deposit":
        return "#4CAF50";
      case "withdraw":
      case "refund":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case "week":
        return "7 ngày qua";
      case "month":
        return "30 ngày qua";
      case "year":
        return "12 tháng qua";
      default:
        return "";
    }
  };

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
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyIcon}>📊</Text>
        </TouchableOpacity>
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
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => setShowWithdrawModal(true)}
            >
              <Text style={styles.withdrawButtonText}>📤 Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Thống kê doanh thu</Text>
          <View style={styles.periodTabs}>
            {["week", "month", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodTab,
                  selectedPeriod === period && styles.periodTabActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    selectedPeriod === period && styles.periodTabTextActive,
                  ]}
                >
                  {period === "week"
                    ? "Tuần"
                    : period === "month"
                    ? "Tháng"
                    : "Năm"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Revenue Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {formatCurrency(walletData.revenueStats.totalRevenue)}
            </Text>
            <Text style={styles.statLabel}>Tổng doanh thu</Text>
            <Text style={styles.statPeriod}>{getPeriodText()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {walletData.revenueStats.totalBookings || 0}
            </Text>
            <Text style={styles.statLabel}>Tổng booking</Text>
            <Text style={styles.statPeriod}>{getPeriodText()}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {formatCurrency(walletData.revenueStats.averageBookingValue)}
            </Text>
            <Text style={styles.statLabel}>Giá trị TB/booking</Text>
            <Text style={styles.statPeriod}>{getPeriodText()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {walletData.revenueStats.completionRate || 0}%
            </Text>
            <Text style={styles.statLabel}>Tỷ lệ hoàn thành</Text>
            <Text style={styles.statPeriod}>{getPeriodText()}</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>

          {walletData.transactions.length > 0 ? (
            walletData.transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionIcon}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.createdAt)}
                    </Text>
                    {transaction.bookingId && (
                      <Text style={styles.transactionId}>
                        ID: {transaction.bookingId}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type) },
                    ]}
                  >
                    {transaction.type === "withdraw" ||
                    transaction.type === "refund"
                      ? "-"
                      : "+"}
                    {formatCurrency(transaction.amount)} VNĐ
                  </Text>
                  <Text style={styles.transactionStatus}>
                    {transaction.status}
                  </Text>
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

      {/* Withdraw Modal */}
      <Modal visible={showWithdrawModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rút tiền</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số tiền muốn rút</Text>
                <TextInput
                  style={styles.textInput}
                  value={
                    withdrawAmount
                      ? formatCurrency(withdrawAmount.replace(/[^0-9]/g, ""))
                      : ""
                  }
                  onChangeText={(text) =>
                    setWithdrawAmount(text.replace(/[^0-9]/g, ""))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                />
                <Text style={styles.balanceNote}>
                  Số dư khả dụng: {formatCurrency(walletData.balance)} VNĐ
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên ngân hàng</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankInfo.bankName}
                  onChangeText={(text) =>
                    setBankInfo({ ...bankInfo, bankName: text })
                  }
                  placeholder="VD: Vietcombank"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số tài khoản</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankInfo.accountNumber}
                  onChangeText={(text) =>
                    setBankInfo({ ...bankInfo, accountNumber: text })
                  }
                  placeholder="Nhập số tài khoản"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên chủ tài khoản</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankInfo.accountName}
                  onChangeText={(text) =>
                    setBankInfo({ ...bankInfo, accountName: text })
                  }
                  placeholder="Nhập tên chủ tài khoản"
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleWithdraw}
              >
                <Text style={styles.confirmButtonText}>Xác nhận rút tiền</Text>
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
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  historyIcon: {
    fontSize: 16,
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
  balanceActions: {
    flexDirection: "row",
    gap: 12,
  },
  withdrawButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  withdrawButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  periodSelector: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  periodTabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  periodTabActive: {
    backgroundColor: "#2E7D32",
  },
  periodTabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  periodTabTextActive: {
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginBottom: 2,
  },
  statPeriod: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  transactionSection: {
    marginTop: 24,
    marginBottom: 32,
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
  transactionId: {
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
  balanceNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
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

export default OwnerWalletScreen;
