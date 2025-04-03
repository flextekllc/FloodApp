import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Shift, Worker } from '../../types';

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    axios
      .get<Shift[]>('https://esr-backend-dev.flextekllc.com/api/shifts')
      .then((res) => setShifts(res.data))
      .catch((err) => console.error('❌ Error fetching shifts:', err));
  }, []);

  const now = new Date();

  const upcomingShifts = shifts.filter((shift) => {
    const end = new Date(shift.end_datetime);
    return end > now;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Upcoming Shifts</Text>

      <FlatList
        data={upcomingShifts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>Start: {item.start_datetime}</Text>
            <Text style={styles.info}>End: {item.end_datetime}</Text>
            <Text style={styles.info}>Workers:</Text>
            {item.workers?.map((worker: Worker) => (
              <Text key={worker.id} style={styles.worker}>
                • {worker.first_name} {worker.last_name}
              </Text>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>No upcoming shifts.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D9252B',
    marginBottom: 12,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9252B33',
    borderRadius: 8,
    marginBottom: 12
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#D9252B' },
  info: { fontSize: 14, color: '#333' },
  worker: { fontSize: 14, color: '#555', marginLeft: 8 },
  noResult: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20
  }
});
