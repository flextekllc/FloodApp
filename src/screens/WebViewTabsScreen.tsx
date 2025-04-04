import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewTabsScreen = () => {
  const [activeTab, setActiveTab] = useState('facebook');

  const renderWebView = () => {
    const url = activeTab === 'facebook'
      ? 'https://www.facebook.com/sandbags.info'
      : 'https://www.instagram.com/sandbags.info?igsh=YWFjZmxrMm5hNnhr';

    return <WebView source={{ uri: url }} style={styles.webview} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'facebook' && styles.activeTab]}
          onPress={() => setActiveTab('facebook')}
        >
          <Text style={styles.tabText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'instagram' && styles.activeTab]}
          onPress={() => setActiveTab('instagram')}
        >
          <Text style={styles.tabText}>Instagram</Text>
        </TouchableOpacity>
      </View>
      {renderWebView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#D9252B',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewTabsScreen;
