import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Types
type Worker = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  status?: string;
  shift_worker_id?: number;
  worker_id?: number;
};

type Shift = {
  id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  workers?: Worker[];
};

export default function ShiftListScreen() {
  const { worker: loggedInWorker } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://esr-backend-dev.flextekllc.com/api/shifts');
        const shifts = res.data;

        const shiftsWithWorkers = await Promise.all(
          shifts.map(async (shift: Shift) => {
            try {
              const response = await axios.get(
                `https://esr-backend-dev.flextekllc.com/api/shifts/${shift.id}/workers`
              );
              const enrichedWorkers = await Promise.all(
                response.data.map(async (worker: Worker) => {
                  try {
                    const swRes = await axios.get(`https://esr-backend-dev.flextekllc.com/api/shift-workers/${worker.worker_id}/${shift.id}`);
                    return { ...worker, status: swRes.data.status, shift_worker_id: swRes.data.id };
                  } catch (err) {
                    console.error('Failed to fetch status for worker:', worker.id, err);
                    return worker;
                  }
                })
              );
              return { ...shift, workers: enrichedWorkers };
            } catch (error) {
              console.error(`Error fetching workers for shift ${shift.id}:`, error);
              return { ...shift, workers: [] };
            }
          })
        );

        setShifts(shiftsWithWorkers);
        setFilteredShifts(shiftsWithWorkers);
        setLoading(false);
      } catch (err) {
        console.error('Error loading shifts:', err);
        setLoading(false);
      }
    };

    fetchData();
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

  const updateStatus = async (shiftWorkerId: number, status: string) => {
    try {
      await axios.put(`https://esr-backend-dev.flextekllc.com/api/shift-workers/${shiftWorkerId}`, { status });
      const updated = filteredShifts.map(shift => {
        const updatedWorkers = shift.workers?.map(worker =>
          worker.shift_worker_id === shiftWorkerId ? { ...worker, status } : worker
        );
        return { ...shift, workers: updatedWorkers };
      });
      setFilteredShifts(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const renderStatusBadge = (status?: string) => {
    const badgeStyles = [styles.statusBadge];
    if (status === 'Accepted') badgeStyles.push(styles.acceptedBadge);
    else if (status === 'Declined') badgeStyles.push(styles.declinedBadge);
    else badgeStyles.push(styles.scheduledBadge);

    return (
      <View style={badgeStyles}>
        <Text style={styles.badgeText}>{status || 'Scheduled'}</Text>
      </View>
    );
  };

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
        <Text style={styles.matchCount}>Total Shifts Found: {matchCount}</Text>
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
                item.workers.map((worker) => {
                  const isLoggedInUser = worker.worker_id === loggedInWorker?.id;
                  const hasResponded = worker.status === 'Accepted' || worker.status === 'Declined';

                  return (
                    <View key={worker.id} style={styles.workerItem}>
                      <Text
                        style={[styles.workerName, isLoggedInUser && styles.loggedInWorkerName]}
                      >
                        👤 {worker.first_name} {worker.last_name}
                      </Text>
                      {isLoggedInUser && !hasResponded ? (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => updateStatus(worker.shift_worker_id!, 'Accepted')}
                          >
                            <Text style={styles.actionText}>✅ Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.declineBtn}
                            onPress={() => updateStatus(worker.shift_worker_id!, 'Declined')}
                          >
                            <Text style={styles.actionText}>❌ Decline</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        renderStatusBadge(worker.status)
                      )}
                    </View>
                  );
                })
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
  shiftName: { fontSize: 18, fontWeight: 'bold', color: '#D9252B', paddingTop: 1 },
  date: { fontSize: 14, color: '#444', marginVertical: 6 },
  workersTitle: { fontWeight: 'bold', color: '#000', marginTop: 8 },
  workerItem: { marginBottom: 20 },
  workerName: { marginLeft: 8, color: '#333', fontSize: 15, fontWeight: '600' },
  loggedInWorkerName: { color: 'red' },
  noWorkers: { marginLeft: 8, fontStyle: 'italic', color: '#999' },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8,
    gap: 10,
    flexWrap: 'wrap',
  },
  acceptBtn: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  declineBtn: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusBadge: {
    marginLeft: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  acceptedBadge: { backgroundColor: 'green' },
  declinedBadge: { backgroundColor: 'red' },
  scheduledBadge: { backgroundColor: '#888' },
});
