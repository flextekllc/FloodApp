import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';

type Worker = {
  id: number;
  first_name: string;
  last_name: string;
};

type Shift = {
  id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  workers?: Worker[];
};

export default function ShiftListScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    axios
      .get('https://esr-backend-dev.flextekllc.com/api/shifts')
      .then(async (res) => {
        const shifts = res.data;

        const shiftsWithWorkers = await Promise.all(
          shifts.map(async (shift: Shift) => {
            try {
              const response = await axios.get(
                `https://esr-backend-dev.flextekllc.com/api/shifts/${shift.id}/workers`
              );
              return { ...shift, workers: response.data };
            } catch (error) {
              console.error(`Error fetching workers for shift ${shift.id}:`, error);
              return { ...shift, workers: [] };
            }
          })
        );

        setShifts(shiftsWithWorkers);
        setFilteredShifts(shiftsWithWorkers);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading shifts:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!searchName) {
      setFilteredShifts(shifts);
      setMatchCount(0);
    } else {
      const name = searchName.toLowerCase();
      const result = shifts.filter((shift) =>
        shift.workers?.some((w) =>
          `${w.first_name} ${w.last_name}`.toLowerCase().includes(name)
        )
      );
      setFilteredShifts(result);
      setMatchCount(result.length);
    }
  }, [searchName, shifts]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shifts</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by worker name..."
        value={searchName}
        onChangeText={setSearchName}
      />

      {searchName.length > 0 && (
        <Text style={styles.matchCount}>
          Total Shifts Found: {matchCount}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#D9252B" />
      ) : (
        <FlatList
          data={filteredShifts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.shiftName}>{item.name}</Text>
              <Text style={styles.date}>
                Start: {item.start_datetime}{'\n'}End: {item.end_datetime}
              </Text>
              <Text style={styles.workersTitle}>Workers:</Text>
              {item.workers && item.workers.length > 0 ? (
                item.workers.map((worker) => (
                  <Text key={worker.id} style={styles.workerName}>
                    - {worker.first_name} {worker.last_name}
                  </Text>
                ))
              ) : (
                <Text style={styles.noWorkers}>None assigned</Text>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#D9252B',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9252B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  matchCount: {
    fontSize: 16,
    color: '#D9252B',
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9252B',
    marginBottom: 14,
  },
  shiftName: { fontSize: 18, fontWeight: 'bold', color: '#D9252B' },
  date: { fontSize: 14, color: '#444', marginVertical: 6 },
  workersTitle: { fontWeight: 'bold', color: '#000', marginTop: 8 },
  workerName: { marginLeft: 8, color: '#333', fontSize: 14 },
  noWorkers: { marginLeft: 8, fontStyle: 'italic', color: '#999' },
});
