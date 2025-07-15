import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const faqs = [
  {
    question: 'Làm sao để đặt sân?',
    answer: 'Bạn vào mục Đặt sân, chọn thời gian và sân phù hợp, sau đó xác nhận đặt.'
  },
  {
    question: 'Tôi có thể huỷ đặt sân không?',
    answer: 'Bạn có thể huỷ đặt sân trước giờ chơi tối thiểu 1 tiếng.'
  },
  {
    question: 'Làm sao để nạp tiền vào ví?',
    answer: 'Vào mục Ví, chọn Nạp tiền và làm theo hướng dẫn.'
  },
];

const HelpCenterScreen = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trợ giúp/Hướng dẫn</Text>
      {faqs.map((faq, idx) => (
        <View key={idx} style={styles.faqItem}>
          <TouchableOpacity onPress={() => handleToggle(idx)}>
            <Text style={styles.question}>{faq.question}</Text>
          </TouchableOpacity>
          {openIndex === idx && (
            <Text style={styles.answer}>{faq.answer}</Text>
          )}
        </View>
      ))}
    </ScrollView>
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
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  answer: {
    fontSize: 15,
    color: '#333',
    marginTop: 6,
    paddingLeft: 8,
  },
});

export default HelpCenterScreen; 