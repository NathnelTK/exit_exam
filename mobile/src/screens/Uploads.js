import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export default function Uploads() {
  const [items, setItems] = useState([]);

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
      if (result.canceled) return;
      const file = result.assets[0];
      const form = new FormData();
      form.append('file', {
        uri: file.uri,
        name: file.name || 'upload',
        type: file.mimeType || 'application/octet-stream'
      });
      const res = await axios.post(`${API_BASE}/api/materials`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setItems(prev => [res.data, ...prev]);
    } catch (e) {
      console.error(e);
      Alert.alert('Upload failed', 'Unable to upload file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploads</Text>
      <Button title=\"Upload PDF/Image\" onPress={pickAndUpload} />
      <FlatList
        style={{ marginTop: 12 }}
        data={items}
        keyExtractor={(item) => String(item._id || item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.originalName || item.name}</Text>
            <Text style={styles.meta}>{item.mimetype} • {Math.round((item.size || 0)/1024)} KB</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  item: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  name: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666' }
});

