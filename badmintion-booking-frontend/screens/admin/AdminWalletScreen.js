"use client"

import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock icons - trong thực tế bạn sẽ sử dụng react-native-vector-icons
const Icon = ({ name, size = 20, color = "#666" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.6 }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
)

const { width } = Dimensions.get("window")

export default function AdminWalletScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview") // overview, transactions, withdrawals, analytics
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [selectedBank, setSelectedBank] = useState("")

  // Mock data - trong thực tế sẽ fetch từ API
  const [walletData, setWalletData] = useState({
    balance: {
      total: 45750000,
      available: 42300000,
      pending: 3450000,
      reserved: 0,
    },
    todayStats: {
      revenue: 2850000,
      bookings: 23,
      refunds: 150000,
      withdrawals: 0,
    },
    recentTransactions: [
      {
        id: 1,
        type: "booking",
        customerName: "Nguyễn Văn An",
        amount: 120000,
        fee: 6000,
        netAmount: 114000,
        time: "14:30",
        date: "15/12/2024",
        status: "completed",
        court: "Sân A1",
      },
      {
        id: 2,
        type: "refund",
        customerName: "Trần Thị Bình",
        amount: -100000,
        fee: 0,
        netAmount: -100000,
        time: "13:15",
        date: "15/12/2024",
        status: "completed",
        court: "Sân B2",
      },
      {
        id: 3,
        type: "booking",
        customerName: "Lê Văn Cường",
        amount: 150000,
        fee: 7500,
        netAmount: 142500,
        time: "12:00",
        date: "15/12/2024",
        status: "pending",
        court: "Sân C1",
      },
      {
        id: 4,
        type: "withdrawal",
        customerName: "Rút tiền",
        amount: -5000000,
        fee: 25000,
        netAmount: -5025000,
        time: "10:30",
        date: "14/12/2024",
        status: "completed",
        court: "VCB ****1234",
      },
    ],
    withdrawalRequests: [
      {
        id: 1,
        amount: 2000000,
        bankName: "Vietcombank",
        accountNumber: "****1234",
        requestDate: "15/12/2024",
        status: "pending",
        processingTime: "1-2 ngày làm việc",
      },
      {
        id: 2,
        amount: 5000000,
        bankName: "Techcombank",
        accountNumber: "****5678",
        requestDate: "14/12/2024",
        status: "completed",
        processingTime: "Đã hoàn thành",
      },
    ],
    bankAccounts: [
      {
        id: 1,
        bankName: "Vietcombank",
        accountNumber: "1234567890",
        accountName: "NGUYEN VAN ADMIN",
        isDefault: true,
      },
      {
        id: 2,
        bankName: "Techcombank",
        accountNumber: "0987654321",
        accountName: "NGUYEN VAN ADMIN",
        isDefault: false,
      },
    ],
    analytics: {
      weeklyRevenue: [
        { day: "T2", amount: 3200000 },
        { day: "T3", amount: 2800000 },
        { day: "T4", amount: 4100000 },
        { day: "T5", amount: 3600000 },
        { day: "T6", amount: 5200000 },
        { day: "T7", amount: 6800000 },
        { day: "CN", amount: 7400000 },
      ],
      paymentMethods: [
        { method: "Tiền mặt", percentage: 45, amount: 20587500 },
        { method: "Chuyển kho���n", percentage: 35, amount: 16012500 },
        { method: "Ví điện tử", percentage: 20, amount: 9150000 },
      ],
    },
  })

  const periods = [
    { id: "today", label: "Hôm nay" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
  ]

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "wallet" },
    { id: "transactions", label: "Giao dịch", icon: "list" },
    { id: "withdrawals", label: "Rút tiền", icon: "bank" },
    { id: "analytics", label: "Phân tích", icon: "chart" },
  ]

  const getTransactionIcon = (type) => {
    switch (type) {
      case "booking":
        return "plus"
      case "refund":
        return "minus"
      case "withdrawal":
        return "bank"
      default:
        return "transaction"
    }
  }

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return "#10B981"
    if (amount < 0) return "#EF4444"
    return "#6B7280"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "pending":
        return "#F59E0B"
      case "failed":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "pending":
        return "Đang xử lý"
      case "failed":
        return "Thất bại"
      default:
        return status
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Alert.alert("Thành công", "Dữ liệu đã được cập nhật!")
    }, 2000)
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || !selectedBank) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!")
      return
    }

    const amount = Number.parseInt(withdrawAmount.replace(/[^0-9]/g, ""))
    if (amount < 100000) {
      Alert.alert("Lỗi", "Số tiền rút tối thiểu là 100,000đ!")
      return
    }

    if (amount > walletData.balance.available) {
      Alert.alert("Lỗi", "Số dư không đủ để thực hiện giao dịch!")
      return
    }

    Alert.alert(
      "Xác nhận rút tiền",
      `Rút ${amount.toLocaleString("vi-VN")}đ về tài khoản ${selectedBank}?\n\nPhí giao dịch: ${Math.round(amount * 0.005).toLocaleString("vi-VN")}đ\nThời gian xử lý: 1-2 ngày làm việc`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            setShowWithdrawModal(false)
            setWithdrawAmount("")
            setSelectedBank("")
            Alert.alert("Thành công", "Yêu cầu rút tiền đã được gửi!")
          },
        },
      ],
    )
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "đ"
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Quản lý ví</Text>
      <TouchableOpacity style={styles.settingsButton}>
        <Icon name="settings" size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  )

  const renderBalanceCard = () => (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceTitle}>Số dư ví</Text>
        <TouchableOpacity style={styles.eyeButton}>
          <Icon name="eye" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.totalBalance}>{formatCurrency(walletData.balance.total)}</Text>

      <View style={styles.balanceBreakdown}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Có thể rút</Text>
          <Text style={styles.balanceValue}>{formatCurrency(walletData.balance.available)}</Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Đang xử lý</Text>
          <Text style={styles.balanceValue}>{formatCurrency(walletData.balance.pending)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.withdrawButton} onPress={() => setShowWithdrawModal(true)}>
        <Icon name="bank" size={20} color="#fff" />
        <Text style={styles.withdrawButtonText}>Rút tiền</Text>
      </TouchableOpacity>
    </View>
  )

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.id}
          style={[styles.periodButton, selectedPeriod === period.id && styles.activePeriod]}
          onPress={() => setSelectedPeriod(period.id)}
        >
          <Text style={[styles.periodText, selectedPeriod === period.id && styles.activePeriodText]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderTodayStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#F0FDF4" }]}>
          <Icon name="plus" size={24} color="#10B981" />
          <Text style={styles.statValue}>{formatCurrency(walletData.todayStats.revenue)}</Text>
          <Text style={styles.statLabel}>Doanh thu hôm nay</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#FEF3F2" }]}>
          <Icon name="minus" size={24} color="#EF4444" />
          <Text style={styles.statValue}>{formatCurrency(walletData.todayStats.refunds)}</Text>
          <Text style={styles.statLabel}>Hoàn tiền</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#F0F9FF" }]}>
          <Icon name="calendar" size={24} color="#3B82F6" />
          <Text style={styles.statValue}>{walletData.todayStats.bookings}</Text>
          <Text style={styles.statLabel}>Lượt đặt sân</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#FFFBEB" }]}>
          <Icon name="bank" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{formatCurrency(walletData.todayStats.withdrawals)}</Text>
          <Text style={styles.statLabel}>Rút tiền</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={16} color={activeTab === tab.id ? "#fff" : "#6B7280"} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        {walletData.recentTransactions.slice(0, 5).map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: getTransactionColor(transaction.type, transaction.amount) + "20" },
                ]}
              >
                <Icon
                  name={getTransactionIcon(transaction.type)}
                  size={16}
                  color={getTransactionColor(transaction.type, transaction.amount)}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionCustomer}>{transaction.customerName}</Text>
                <Text style={styles.transactionDetails}>
                  {transaction.court} • {transaction.time}
                </Text>
              </View>
            </View>

            <View style={styles.transactionRight}>
              <Text
                style={[styles.transactionAmount, { color: getTransactionColor(transaction.type, transaction.amount) }]}
              >
                {transaction.amount > 0 ? "+" : ""}
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                  {getStatusText(transaction.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Xem tất cả giao dịch</Text>
          <Icon name="arrow" size={16} color="#10B981" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTransactions = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tất cả giao dịch</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter" size={16} color="#6B7280" />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        {walletData.recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: getTransactionColor(transaction.type, transaction.amount) + "20" },
                ]}
              >
                <Icon
                  name={getTransactionIcon(transaction.type)}
                  size={16}
                  color={getTransactionColor(transaction.type, transaction.amount)}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionCustomer}>{transaction.customerName}</Text>
                <Text style={styles.transactionDetails}>
                  {transaction.court} • {transaction.date} {transaction.time}
                </Text>
                {transaction.fee > 0 && (
                  <Text style={styles.transactionFee}>Phí: {formatCurrency(transaction.fee)}</Text>
                )}
              </View>
            </View>

            <View style={styles.transactionRight}>
              <Text
                style={[styles.transactionAmount, { color: getTransactionColor(transaction.type, transaction.amount) }]}
              >
                {transaction.amount > 0 ? "+" : ""}
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
              <Text style={styles.netAmount}>Thực nhận: {formatCurrency(Math.abs(transaction.netAmount))}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                  {getStatusText(transaction.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderWithdrawals = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yêu cầu rút tiền</Text>
          <TouchableOpacity
            style={styles.addBankButton}
            onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển!")}
          >
            <Icon name="plus" size={16} color="#10B981" />
            <Text style={styles.addBankText}>Thêm TK</Text>
          </TouchableOpacity>
        </View>

        {walletData.withdrawalRequests.map((request) => (
          <View key={request.id} style={styles.withdrawalItem}>
            <View style={styles.withdrawalLeft}>
              <View style={styles.withdrawalIcon}>
                <Icon name="bank" size={20} color="#3B82F6" />
              </View>
              <View style={styles.withdrawalInfo}>
                <Text style={styles.withdrawalAmount}>{formatCurrency(request.amount)}</Text>
                <Text style={styles.withdrawalBank}>
                  {request.bankName} {request.accountNumber}
                </Text>
                <Text style={styles.withdrawalDate}>{request.requestDate}</Text>
              </View>
            </View>

            <View style={styles.withdrawalRight}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                  {getStatusText(request.status)}
                </Text>
              </View>
              <Text style={styles.processingTime}>{request.processingTime}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản ngân hàng</Text>
        {walletData.bankAccounts.map((account) => (
          <View key={account.id} style={styles.bankAccountItem}>
            <View style={styles.bankAccountLeft}>
              <View style={styles.bankIcon}>
                <Text style={styles.bankIconText}>{account.bankName.charAt(0)}</Text>
              </View>
              <View style={styles.bankAccountInfo}>
                <Text style={styles.bankName}>{account.bankName}</Text>
                <Text style={styles.accountNumber}>****{account.accountNumber.slice(-4)}</Text>
                <Text style={styles.accountName}>{account.accountName}</Text>
              </View>
            </View>

            <View style={styles.bankAccountRight}>
              {account.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Mặc định</Text>
                </View>
              )}
              <TouchableOpacity style={styles.bankActionButton}>
                <Icon name="edit" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doanh thu theo ngày</Text>
        <View style={styles.chartContainer}>
          {walletData.analytics.weeklyRevenue.map((item, index) => {
            const maxAmount = Math.max(...walletData.analytics.weeklyRevenue.map((d) => d.amount))
            const height = (item.amount / maxAmount) * 120
            return (
              <View key={index} style={styles.chartItem}>
                <View style={[styles.chartBar, { height }]} />
                <Text style={styles.chartLabel}>{item.day}</Text>
                <Text style={styles.chartValue}>{(item.amount / 1000000).toFixed(1)}M</Text>
              </View>
            )
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {walletData.analytics.paymentMethods.map((method, index) => (
          <View key={index} style={styles.paymentMethodItem}>
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodName}>{method.method}</Text>
              <Text style={styles.paymentMethodAmount}>{formatCurrency(method.amount)}</Text>
            </View>
            <View style={styles.paymentMethodRight}>
              <Text style={styles.paymentMethodPercentage}>{method.percentage}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${method.percentage}%` }]} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderWithdrawModal = () => (
    <Modal visible={showWithdrawModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rút tiền</Text>
            <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
              <Icon name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.availableBalance}>
              <Text style={styles.availableBalanceLabel}>Số dư có thể rút</Text>
              <Text style={styles.availableBalanceValue}>{formatCurrency(walletData.balance.available)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số tiền rút</Text>
              <TextInput
                style={styles.amountInput}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="Nhập số tiền"
                keyboardType="numeric"
              />
              <Text style={styles.inputNote}>Tối thiểu: 100,000đ</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tài khoản nhận</Text>
              {walletData.bankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.bankOption, selectedBank === account.id && styles.selectedBankOption]}
                  onPress={() => setSelectedBank(account.id)}
                >
                  <View style={styles.bankOptionLeft}>
                    <View style={styles.bankOptionIcon}>
                      <Text style={styles.bankOptionIconText}>{account.bankName.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.bankOptionName}>{account.bankName}</Text>
                      <Text style={styles.bankOptionNumber}>****{account.accountNumber.slice(-4)}</Text>
                    </View>
                  </View>
                  {selectedBank === account.id && <Icon name="check" size={20} color="#10B981" />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.feeInfo}>
              <Text style={styles.feeInfoText}>Phí giao dịch: 0.5% (tối thiểu 5,000đ)</Text>
              <Text style={styles.feeInfoText}>Thời gian xử lý: 1-2 ngày làm việc</Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowWithdrawModal(false)}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleWithdraw}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "transactions":
        return renderTransactions()
      case "withdrawals":
        return renderWithdrawals()
      case "analytics":
        return renderAnalytics()
      default:
        return renderOverview()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {renderBalanceCard()}
        {renderPeriodSelector()}
        {renderTodayStats()}
        {renderTabs()}
        {renderTabContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderWithdrawModal()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  iconPlaceholder: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  balanceCard: {
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  eyeButton: {
    padding: 4,
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  balanceBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  balanceItem: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 12,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  periodContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  activePeriod: {
    backgroundColor: "#10B981",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activePeriodText: {
    color: "#fff",
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  filterText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  addBankButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F0FDF4",
  },
  addBankText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
    marginLeft: 4,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCustomer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  transactionDetails: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  transactionFee: {
    fontSize: 11,
    color: "#EF4444",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  netAmount: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
    marginRight: 4,
  },
  withdrawalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  withdrawalLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  withdrawalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  withdrawalInfo: {
    flex: 1,
  },
  withdrawalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  withdrawalBank: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  withdrawalDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  withdrawalRight: {
    alignItems: "flex-end",
  },
  processingTime: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  bankAccountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bankAccountLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bankIconText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bankAccountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  accountName: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  bankAccountRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  defaultBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  bankActionButton: {
    padding: 8,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
    paddingTop: 20,
  },
  chartItem: {
    alignItems: "center",
    flex: 1,
  },
  chartBar: {
    backgroundColor: "#10B981",
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  paymentMethodLeft: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  paymentMethodAmount: {
    fontSize: 14,
    color: "#6B7280",
  },
  paymentMethodRight: {
    alignItems: "flex-end",
    width: 100,
  },
  paymentMethodPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 4,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  availableBalance: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  availableBalanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  availableBalanceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  inputNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  bankOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedBankOption: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  bankOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bankOptionIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bankOptionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  bankOptionNumber: {
    fontSize: 14,
    color: "#6B7280",
  },
  feeInfo: {
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  feeInfoText: {
    fontSize: 12,
    color: "#92400E",
    marginBottom: 2,
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#10B981",
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomPadding: {
    height: 32,
  },
})
