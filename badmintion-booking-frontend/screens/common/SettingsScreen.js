import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleChangePassword = () => {
    Alert.alert('Đổi mật khẩu', 'Chức năng này đang được phát triển.');
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Đổi mật khẩu" onPress={handleChangePassword} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Đăng xuất" color="#d9534f" onPress={handleLogout} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default SettingsScreen; 