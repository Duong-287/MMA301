import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';

const transactions = [
  { id: '1', type: 'Nạp tiền', amount: 200000, date: '2024-07-20' },
  { id: '2', type: 'Đặt sân', amount: -100000, date: '2024-07-21' },
  { id: '3', type: 'Hoàn tiền', amount: 50000, date: '2024-07-22' },
];

const WaletScreen = () => {
  const [balance, setBalance] = useState(150000);

  const handleDeposit = () => {
    Alert.alert('Nạp tiền', 'Chức năng nạp tiền đang phát triển.');
  };

  const handleWithdraw = () => {
    Alert.alert('Rút tiền', 'Chức năng rút tiền đang phát triển.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transType}>{item.type}</Text>
      <Text style={item.amount > 0 ? styles.amountPlus : styles.amountMinus}>
        {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} đ
      </Text>
      <Text style={styles.transDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ví của bạn</Text>
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Số dư hiện tại:</Text>
        <Text style={styles.balance}>{balance.toLocaleString()} đ</Text>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Nạp tiền" onPress={handleDeposit} />
        <View style={{ width: 16 }} />
        <Button title="Rút tiền" color="#d9534f" onPress={handleWithdraw} />
      </View>
      <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  balanceBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#555',
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  transType: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  amountPlus: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  amountMinus: {
    color: '#d9534f',
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  transDate: {
    fontSize: 13,
    color: '#888',
    flex: 1,
    textAlign: 'right',
  },
});

export default WaletScreen;
