import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const bookings = [
  { id: '1', court: 'Sân A', date: '2024-07-20', time: '10:00 - 11:00', status: 'Đã xác nhận' },
  { id: '2', court: 'Sân B', date: '2024-07-22', time: '14:00 - 15:00', status: 'Đã huỷ' },
  { id: '3', court: 'Sân C', date: '2024-07-25', time: '08:00 - 09:00', status: 'Chờ xác nhận' },
];

const BookingHistoryScreen = () => {
  const handlePress = (item) => {
    Alert.alert('Chi tiết đặt sân', `Sân: ${item.court}\nNgày: ${item.date}\nGiờ: ${item.time}\nTrạng thái: ${item.status}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <View style={styles.row}>
        <Text style={styles.court}>{item.court}</Text>
        <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
      </View>
      <Text style={styles.date}>{item.date} | {item.time}</Text>
    </TouchableOpacity>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return { color: '#28a745' };
      case 'Đã huỷ':
        return { color: '#d9534f' };
      case 'Chờ xác nhận':
        return { color: '#ffc107' };
      default:
        return { color: '#333' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đặt sân</Text>
      <FlatList
        data={bookings}
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
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  court: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
});

export default BookingHistoryScreen;
