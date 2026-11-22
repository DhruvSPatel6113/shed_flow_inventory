import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useInventoryStore } from '../store/inventoryStore';

export default function InventoryListScreen() {
  const { products } = useInventoryStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprehensive SKU Registry</Text>
      <Text style={styles.subtitle}>Detailed stock levels categorized across all storage and production facilities.</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.skuBadge}>{item.sku}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>

            <View style={styles.grid}>
              {Object.entries(item.shedStock).map(([shed, count]) => (
                <View key={shed} style={styles.gridItem}>
                  <Text style={styles.shedLabel}>{shed.split(' ')[0]} {shed.split(' ')[1]}</Text>
                  <Text style={styles.countText}>{count} {item.unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', padding: 20 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94a3b8', fontSize: 13, marginBottom: 16 },
  list: { gap: 14 },
  card: { backgroundColor: '#131b2e', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1e293b' },
  header: { marginBottom: 14 },
  skuBadge: { color: '#38bdf8', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#090d16', borderRadius: 10, padding: 12 },
  gridItem: { alignItems: 'center' },
  shedLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  countText: { color: '#4ade80', fontSize: 14, fontWeight: '800' },
});
