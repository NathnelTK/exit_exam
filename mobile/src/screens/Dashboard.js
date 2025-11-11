import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exit - Exam Prep (Mobile)</Text>
      <Button title=\"Go to Settings\" onPress={() => navigation.navigate('Settings')} />
      <Button title=\"Uploads\" onPress={() => navigation.navigate('Uploads')} />
      <Button title=\"Weekly Plan\" onPress={() => navigation.navigate('WeeklyPlan')} />
      <Button title=\"Mock Exam\" onPress={() => navigation.navigate('MockExam')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 }
});

