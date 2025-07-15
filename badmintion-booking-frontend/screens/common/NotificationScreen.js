import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const notifications = [
  { id: '1', title: 'Đặt sân thành công', content: 'Bạn đã đặt sân vào 10:00 ngày 20/07/2024.' },
  { id: '2', title: 'Cập nhật lịch thi đấu', content: 'Lịch thi đấu mới đã được cập nhật.' },
  { id: '3', title: 'Khuyến mãi mới', content: 'Nhận ưu đãi 10% cho lần đặt sân tiếp theo.' },
];

const NotificationScreen = () => {
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
      <Text style={styles.title}>Thông báo</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
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

export default NotificationScreen; 