import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useInventoryStore } from '../store/inventoryStore';

export default function TransferScreen() {
  const { products, sheds, transferStock } = useInventoryStore();
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '1');
  const [fromShed, setFromShed] = useState(sheds[0]);
  const [toShed, setToShed] = useState(sheds[1]);
  const [quantity, setQuantity] = useState('25');

  const handleTransfer = () => {
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid transfer quantity.');
      return;
    }
    if (fromShed === toShed) {
      Alert.alert('Invalid Destination', 'Source shed and destination shed cannot be identical.');
      return;
    }

    const prod = products.find((p) => p.id === selectedProduct);
    const available = prod?.shedStock[fromShed] || 0;
    if (available < qty) {
      Alert.alert('Insufficient Stock', `Only ${available} ${prod?.unit} available in ${fromShed}.`);
      return;
    }

    transferStock(selectedProduct, fromShed, toShed, qty);
    Alert.alert('Transfer Success', `Transferred ${qty} ${prod?.unit} from ${fromShed} to ${toShed}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Inter-Shed Stock Transfer</Text>
      <Text style={styles.subtitle}>
        Relocate raw materials, work-in-progress components, and finished units between warehouse sheds.
      </Text>

      {/* Select Product */}
      <Text style={styles.label}>SELECT SKU / PRODUCT</Text>
      <View style={styles.selectorGroup}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.pill, selectedProduct === p.id && styles.pillActive]}
            onPress={() => setSelectedProduct(p.id)}
          >
            <Text style={[styles.pillText, selectedProduct === p.id && styles.pillTextActive]}>
              {p.sku} ({p.name})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Source Shed */}
      <Text style={styles.label}>SOURCE SHED (FROM)</Text>
      <View style={styles.selectorGroup}>
        {sheds.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.pill, fromShed === s && styles.pillActive]}
            onPress={() => setFromShed(s)}
          >
            <Text style={[styles.pillText, fromShed === s && styles.pillTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Destination Shed */}
      <Text style={styles.label}>DESTINATION SHED (TO)</Text>
      <View style={styles.selectorGroup}>
        {sheds.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.pill, toShed === s && styles.pillActive]}
            onPress={() => setToShed(s)}
          >
            <Text style={[styles.pillText, toShed === s && styles.pillTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quantity */}
      <Text style={styles.label}>TRANSFER QUANTITY</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity style={styles.transferBtn} onPress={handleTransfer}>
        <Text style={styles.transferBtnText}>📦 Authorize & Execute Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94a3b8', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  label: { color: '#38bdf8', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  selectorGroup: { gap: 8, marginBottom: 10 },
  pill: {
    backgroundColor: '#131b2e',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  pillActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  pillText: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#ffffff', fontWeight: '800' },
  input: {
    backgroundColor: '#131b2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    padding: 14,
    marginBottom: 20,
  },
  transferBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  transferBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
