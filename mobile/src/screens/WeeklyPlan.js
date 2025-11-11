import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export default function WeeklyPlan() {
  const [plan, setPlan] = useState(null);

  const generate = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/weekly-plans/generate`, {});
      setPlan(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to generate weekly plan.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Plan</Text>
      <Button title=\"Generate Weekly Plan\" onPress={generate} />
      {plan && (
        <FlatList
          style={{ marginTop: 12 }}
          data={plan.days || []}
          keyExtractor={(d, idx) => String(idx)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.date}</Text>
              <Text style={styles.meta}>{item.courseName} • {item.minutes} min</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  item: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  name: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666' }
});

