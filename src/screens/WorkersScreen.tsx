import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';
import { Worker } from '../../types';

export default function WorkersScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get<Worker[]>('https://esr-backend-dev.flextekllc.com/api/workers')
      .then((res) => setWorkers(res.data))
      .catch((err) => console.error('❌ Error fetching workers:', err));
  }, []);

  // Filter workers based on search
  const filteredWorkers = workers.filter((worker) => {
    const fullName = `${worker.first_name} ${worker.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All Workers</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by name..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.info}>Phone: {item.phone_number}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>No matching workers found.</Text>
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
  search: {
    borderWidth: 1,
    borderColor: '#D9252B88',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
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
  noResult: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20
  }
});
