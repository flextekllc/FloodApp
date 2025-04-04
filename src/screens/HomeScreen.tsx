import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const managerPhone = '+14794276215'; // Replace with real number

  const handleCall = () => {
    Linking.openURL(`tel:${managerPhone}`);
    setModalVisible(false);
  };

  const handleSMS = () => {
    Linking.openURL(`sms:${managerPhone}`);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Flood App Home</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Workers')}>
          <Text style={styles.buttonText}>View Workers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Shifts')}>
          <Text style={styles.buttonText}>Upcoming Shifts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShiftListScreen')}>
          <Text style={styles.buttonText}>Shceduled Workers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShiftCalendar')}>
          <Text style={styles.buttonText}>View Shift Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SocialWebView')}>
          <Text style={styles.buttonText}>Connect to our Social Media</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.helpButton]} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Support</Text>
        </TouchableOpacity>

        {/* Help Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Contact Manager</Text>
              <Pressable style={styles.modalButton} onPress={handleCall}>
                <Text style={styles.modalButtonText}>📞 Call Manager</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleSMS}>
                <Text style={styles.modalButtonText}>💬 Message Manager</Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D9252B',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#D9252B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  helpButton: {
    backgroundColor: '#000', // Make Help button stand out
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 32,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D9252B',
  },
  modalButton: {
    backgroundColor: '#D9252B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
});
