import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const CustomerSupportScreen = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung hỗ trợ!');
      return;
    }
    Alert.alert('Đã gửi', 'Yêu cầu hỗ trợ của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hỗ trợ khách hàng</Text>
      <Text style={styles.label}>Nội dung yêu cầu:</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Nhập nội dung cần hỗ trợ..."
        multiline
        numberOfLines={5}
      />
      <View style={{ marginTop: 24 }}>
        <Button title="Gửi yêu cầu" onPress={handleSend} />
      </View>
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
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default CustomerSupportScreen; 