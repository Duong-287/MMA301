import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const notifications = [
  { id: '1', title: 'Xác nhận đặt sân', content: 'Đơn đặt sân của bạn đã được xác nhận.' },
  { id: '2', title: 'Khuyến mãi mới', content: 'Nhận mã giảm giá 20% cho lần đặt tiếp theo.' },
  { id: '3', title: 'Nhắc nhở', content: 'Bạn có lịch đặt sân vào ngày mai lúc 10:00.' },
];

const CustomerNotificationScreen = () => {
  const handlePress = (item) => {
    Alert.alert(item.title, item.content);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent} numberOfLines={1}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo của bạn</Text>
      <FlatList
        data={notifications}
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
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemContent: {
    fontSize: 14,
    color: '#555',
  },
});

export default CustomerNotificationScreen; 