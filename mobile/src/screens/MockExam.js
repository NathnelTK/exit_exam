import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export default function MockExam() {
  const [mock, setMock] = useState(null);

  const generateMock = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/mock-exams/generate`, {});
      setMock(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to generate mock exam.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Model Exam</Text>
      <Button title=\"Generate Mock Exam\" onPress={generateMock} />
      {mock && (
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: '600' }}>Questions: {mock.questions?.length || 0}</Text>
          <Text>Note: Question content generation is a placeholder.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 }
});

