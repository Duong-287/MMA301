import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker, Button, TextInput, Alert } from 'react-native';

const courts = [
  { id: 'A', name: 'Sân A' },
  { id: 'B', name: 'Sân B' },
  { id: 'C', name: 'Sân C' },
];

const times = [
  '08:00 - 09:00',
  '10:00 - 11:00',
  '14:00 - 15:00',
];

const BookingScreen = () => {
  const [selectedCourt, setSelectedCourt] = useState(courts[0].id);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [selectedDate, setSelectedDate] = useState('2024-07-25');
  const [note, setNote] = useState('');

  const handleBooking = () => {
    Alert.alert('Xác nhận đặt sân', `Sân: ${courts.find(c => c.id === selectedCourt).name}\nNgày: ${selectedDate}\nGiờ: ${selectedTime}\nGhi chú: ${note}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt sân</Text>
      <Text style={styles.label}>Chọn sân:</Text>
      <Picker
        selectedValue={selectedCourt}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCourt(itemValue)}
      >
        {courts.map(court => (
          <Picker.Item key={court.id} label={court.name} value={court.id} />
        ))}
      </Picker>
      <Text style={styles.label}>Chọn ngày:</Text>
      <TextInput
        style={styles.input}
        value={selectedDate}
        onChangeText={setSelectedDate}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Chọn giờ:</Text>
      <Picker
        selectedValue={selectedTime}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
      >
        {times.map(time => (
          <Picker.Item key={time} label={time} value={time} />
        ))}
      </Picker>
      <Text style={styles.label}>Ghi chú:</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={note}
        onChangeText={setNote}
        placeholder="Nhập ghi chú (nếu có)"
        multiline
      />
      <View style={{ marginTop: 24 }}>
        <Button title="Xác nhận đặt sân" onPress={handleBooking} />
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Thông tin đã chọn:</Text>
        <Text>Sân: {courts.find(c => c.id === selectedCourt).name}</Text>
        <Text>Ngày: {selectedDate}</Text>
        <Text>Giờ: {selectedTime}</Text>
        <Text>Ghi chú: {note || '(Không có)'}</Text>
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
  picker: {
    height: 44,
    marginBottom: 8,
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
  summaryBox: {
    marginTop: 32,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
});

export default BookingScreen;
