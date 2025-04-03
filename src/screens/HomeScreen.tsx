import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flood App Home</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Workers')}>
        <Text style={styles.buttonText}>View Workers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Shifts')}>
        <Text style={styles.buttonText}>View Shifts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShiftListScreen')}>
        <Text style={styles.buttonText}>All Shifts + Workers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShiftCalendar')}>
        <Text style={styles.buttonText}>View Shift Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Facebook')}>
        <Text style={styles.buttonText}>Open Facebook Page</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D9252B',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D9252B',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
