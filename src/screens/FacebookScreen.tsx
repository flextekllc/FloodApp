import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

const FACEBOOK_URL = 'https://m.facebook.com/sandbags.info';

export default function FacebookScreen() {
  const openFacebook = () => {
    Linking.canOpenURL(FACEBOOK_URL).then((supported) => {
      if (supported) {
        Linking.openURL(FACEBOOK_URL);
      } else {
        console.warn('Unable to open Facebook URL');
      }
    });
  };

  if (Platform.OS === 'android') {
    // Android fallback: open in browser
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Facebook Page</Text>
          <Text style={styles.subtitle}>
            Facebook cannot be displayed inside the app on Android.
          </Text>
          <TouchableOpacity style={styles.button} onPress={openFacebook}>
            <Text style={styles.buttonText}>Open in Facebook</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // iOS: show WebView
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: FACEBOOK_URL }}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        originWhitelist={['https://*']}
        mixedContentMode="always"
        startInLoadingState
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D9252B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D9252B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
