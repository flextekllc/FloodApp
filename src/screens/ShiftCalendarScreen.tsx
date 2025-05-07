import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Shift = {
  id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
};

type Worker = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  position: string;
  status: string;
};

export default function ShiftCalendarScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [workerMap, setWorkerMap] = useState<Record<number, Worker[]>>({});
  const [showWorkersMap, setShowWorkersMap] = useState<Record<number, boolean>>({});
  const [userPhone, setUserPhone] = useState<string>('');

  useEffect(() => {
    axios
      .get('https://esr-backend-dev.flextekllc.com/api/shifts')
      .then((res) => {
        setShifts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading shifts:', err);
        setLoading(false);
      });

    const loadPhone = async () => {
      const stored = await AsyncStorage.getItem('userPhoneNumber');
      if (stored) setUserPhone(stored);
    };
    loadPhone();
  }, []);

  const fetchWorkers = async (shiftId: number) => {
    if (workerMap[shiftId]) {
      setShowWorkersMap((prev) => ({ ...prev, [shiftId]: !prev[shiftId] }));
      return;
    }

    try {
      const res = await axios.get(
        `https://esr-backend-dev.flextekllc.com/api/shifts/${shiftId}/workers`
      );
      setWorkerMap((prev) => ({ ...prev, [shiftId]: res.data }));
      setShowWorkersMap((prev) => ({ ...prev, [shiftId]: true }));
    } catch (err) {
      console.error(`Failed to load workers for shift ${shiftId}:`, err);
    }
  };

  const getMarkedDates = () => {
    const marks: Record<string, any> = {};
    shifts.forEach((s) => {
      const date = s.start_datetime.split('T')[0];
      marks[date] = {
        marked: true,
        dotColor: '#D9252B',
        selected: selectedDate === date,
        selectedColor: selectedDate === date ? '#D9252B' : undefined,
      };
    });
    return marks;
  };

  const renderShiftCard = (shift: Shift) => {
    const workers = workerMap[shift.id] || [];
    const show = showWorkersMap[shift.id];

    return (
      <View key={shift.id} style={styles.card}>
        <Text style={styles.shiftName}>{shift.name}</Text>
        <Text style={styles.date}>Start: {shift.start_datetime}</Text>
        <Text style={styles.date}>End: {shift.end_datetime}</Text>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => fetchWorkers(shift.id)}
        >
          <Text style={styles.buttonText}>{show ? 'Hide Workers' : 'Show Workers'}</Text>
        </TouchableOpacity>

        {show && workers.length > 0 && (
          <View style={styles.workerList}>
            {workers.map((w) => {
              const isCurrentUser = w.phone_number.replace(/\D/g, '') === userPhone.replace(/\D/g, '');
              return (
                <View key={w.id} style={styles.workerCard}>
                  <Text style={styles.workerName}>{w.first_name} {w.last_name}</Text>
                  <Text style={styles.workerDetails}>Position: {w.position}</Text>
                  <Text style={styles.workerDetails}>City: {w.city}</Text>
                  <Text style={styles.workerDetails}>Status: {w.status}</Text>

                  {isCurrentUser && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.acceptBtn}>
                        <Text style={styles.actionText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineBtn}>
                        <Text style={styles.actionText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const filteredShifts = selectedDate
    ? shifts.filter((s) => s.start_datetime.startsWith(selectedDate))
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shift Calendar</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#D9252B" />
      ) : (
        <FlatList
          data={filteredShifts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderShiftCard(item)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D9252B',
    marginVertical: 10,
  },
  card: {
    borderColor: '#D9252B',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    margin: 10,
    backgroundColor: '#fff',
  },
  shiftName: { fontSize: 18, fontWeight: 'bold', color: '#D9252B' },
  date: { fontSize: 14, marginVertical: 4 },
  toggleButton: {
    backgroundColor: '#D9252B',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  workerList: { marginTop: 12 },
  workerCard: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  workerName: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  workerDetails: { fontSize: 14, color: '#333' },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  acceptBtn: {
    backgroundColor: 'green',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  declineBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
