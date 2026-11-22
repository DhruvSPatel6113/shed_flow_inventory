import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useInventoryStore } from '../store/inventoryStore';

export default function DispatchScreen() {
  const { products, logDispatch } = useInventoryStore();
  const [buyer, setBuyer] = useState('');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'ST-501');
  const [quantity, setQuantity] = useState('50');
  const [vehicle, setVehicle] = useState('MH-04-TR-9901');

  const handleDispatch = () => {
    if (!buyer.trim()) {
      Alert.alert('Required Field', 'Please enter the client / buyer organization.');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid dispatch quantity.');
      return;
    }

    const success = logDispatch(buyer, selectedSku, qty, vehicle);
    if (success) {
      Alert.alert('Dispatch Recorded', `Order for ${qty} units of ${selectedSku} dispatched to ${buyer}.`);
      setBuyer('');
    } else {
      Alert.alert('Dispatch Blocked', 'Insufficient finished goods in Shed C for this SKU.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Outbound Dispatch Slip</Text>
      <Text style={styles.subtitle}>
        Record outward stock movement, buyer billing information, and logistics vehicle numbers.
      </Text>

      <Text style={styles.label}>BUYER / CLIENT ORGANIZATION</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Larsen & Toubro Construction"
        placeholderTextColor="#64748b"
        value={buyer}
        onChangeText={setBuyer}
      />

      <Text style={styles.label}>FINISHED GOOD SKU (SHED C)</Text>
      <View style={styles.skuRow}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.sku}
            style={[styles.skuPill, selectedSku === p.sku && styles.skuPillActive]}
            onPress={() => setSelectedSku(p.sku)}
          >
            <Text style={[styles.skuPillText, selectedSku === p.sku && styles.skuPillTextActive]}>
              {p.sku}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>DISPATCH QUANTITY</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>LOGISTICS VEHICLE REGISTRATION</Text>
      <TextInput
        style={styles.input}
        value={vehicle}
        onChangeText={setVehicle}
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity style={styles.btn} onPress={handleDispatch}>
        <Text style={styles.btnText}>🚚 Generate Dispatch Slip & Deduct Stock</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94a3b8', fontSize: 13, marginBottom: 20, lineHeight: 20 },
  label: { color: '#38bdf8', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: '#131b2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    padding: 14,
    marginBottom: 10,
  },
  skuRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  skuPill: {
    flex: 1,
    backgroundColor: '#131b2e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  skuPillActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  skuPillText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  skuPillTextActive: { color: '#ffffff' },
  btn: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
