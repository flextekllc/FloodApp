import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';

type Worker = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type ShiftWorkersRouteProp = RouteProp<
  { ShiftWorkersScreen: { shiftId: number; shiftName: string } },
  'ShiftWorkersScreen'
>;

export default function ShiftWorkersScreen() {
  const route = useRoute<ShiftWorkersRouteProp>();
  const { shiftId, shiftName } = route.params;
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://esr-backend-dev.flextekllc.com/api/shifts/${shiftId}/workers`)
      .then((res) => {
        setWorkers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load workers for shift:', err);
        setLoading(false);
      });
  }, [shiftId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shift: {shiftName}</Text>
      <Text style={styles.subtitle}>Assigned Workers</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D9252B" />
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.phone}>Phone: {item.phone_number}</Text>
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
    color: '#D9252B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: '#D9252B',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  phone: {
    fontSize: 14,
    color: '#555',
  },
});
