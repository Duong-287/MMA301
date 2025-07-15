import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';

const CustomerProfileEditScreen = () => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=3');

  const handleSave = () => {
    Alert.alert('Lưu thành công', 'Thông tin cá nhân đã được cập nhật!');
  };

  const handleChangeAvatar = () => {
    Alert.alert('Đổi ảnh đại diện', 'Chức năng này đang phát triển.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin</Text>
      <TouchableOpacity onPress={handleChangeAvatar}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.changeAvatar}>Đổi ảnh đại diện</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Họ và tên:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Text style={styles.label}>Số điện thoại:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <View style={{ marginTop: 24 }}>
        <Button title="Lưu thay đổi" onPress={handleSave} />
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 8,
  },
  changeAvatar: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 16,
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
  },
});

export default CustomerProfileEditScreen; 