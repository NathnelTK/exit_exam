import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing } from 'react-native';

export default function Dashboard({ navigation }) {
  const [hourglass, setHourglass] = useState('⏳');
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glyphTimer = setInterval(() => {
      setHourglass((prev) => (prev === '⏳' ? '⌛' : '⏳'));
    }, 1000);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ).start();
    return () => clearInterval(glyphTimer);
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exit - Exam Prep (Mobile)</Text>
      <Animated.View style={[styles.hourglassWrap, { transform: [{ rotate: spin }] }]}>
        <Text style={styles.hourglass}>{hourglass}</Text>
      </Animated.View>
      <Text style={styles.subtitle}>Focus timer</Text>
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title="Uploads" onPress={() => navigation.navigate('Uploads')} />
      <Button title="Weekly Plan" onPress={() => navigation.navigate('WeeklyPlan')} />
      <Button title="Mock Exam" onPress={() => navigation.navigate('MockExam')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  hourglassWrap: { marginVertical: 12 },
  hourglass: { fontSize: 64 }
});

